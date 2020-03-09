<?php
namespace axenox\AngularMaterialFacade\Facades;

use exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade;
use exface\Core\Facades\AbstractAjaxFacade\Middleware\JqueryDataTablesUrlParamsReader;
use exface\Core\Interfaces\DataSheets\DataSheetInterface;
use exface\Core\Interfaces\WidgetInterface;
use Psr\Http\Message\ServerRequestInterface;
use exface\Core\Interfaces\Tasks\ResultInterface;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Psr7\Response;
use exface\Core\Interfaces\Tasks\ResultWidgetInterface;
use axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement;
use exface\Core\Interfaces\Model\UiPageInterface;
use exface\Core\Widgets\AbstractWidget;
use exface\Core\DataTypes\FilePathDataType;
use exface\Core\DataTypes\PhpFilePathDataType;
use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Uxon\UxonSchema;
use exface\Core\Exceptions\RuntimeException;
use exface\Core\DataTypes\StringDataType;

/**
 * 
 * @author Andrej Kabachnik
 * 
 * @method NgmBasicElement getElement()
 *
 */
class AngularMaterialFacade extends AbstractAjaxFacade
{
    private $angularInterfacesByPhpClass = [];

    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::createResponseFromTaskResult()
     */
    protected function createResponseFromTaskResult(ServerRequestInterface $request, ResultInterface $result) : ResponseInterface
    {
        $status_code = $result->getResponseCode();
        $headers = [];
        
        if ($result->isEmpty()) {
            return new Response($status_code);
        }
        
        switch (true) {
            case $result instanceof ResultWidgetInterface:
                $widget = $result->getWidget();
                $headers['Content-type'] = ['application/json;charset=utf-8'];
                $headers = array_merge($headers, $this->buildHeadersAccessControl());
                $body = json_encode($this->getElement($widget)->buildJson());
                break;
            default:
                return parent::createResponseFromTaskResult($request, $result);
        }
        
        $headers = array_merge($headers, $this->buildHeadersAccessControl());
        return new Response($status_code, $headers, $body);
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::createResponseFromError()
     */
    protected function createResponseFromError(ServerRequestInterface $request, \Throwable $exception, UiPageInterface $page = null) : ResponseInterface 
    {
        throw $exception;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::init()
     */
    public function init()
    {
        parent::init();
        $this->setClassPrefix('Ngm');
        $this->setClassNamespace(__NAMESPACE__);
    }
    
    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::getMiddleware()
     */
    protected function getMiddleware() : array
    {
        $middleware = parent::getMiddleware();
        $middleware[] = new JqueryDataTablesUrlParamsReader($this, 'getInputData', 'setInputData');
        return $middleware;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Interfaces\Facades\HttpFacadeInterface::getUrlRoutePatterns()
     */
    public function getUrlRoutePatterns() : array
    {
        return [
            "/\/api\/angular[\/?]/"
        ];
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::buildResponseData()
     */
    public function buildResponseData(DataSheetInterface $data_sheet, WidgetInterface $widget = null)
    {
        $data = array();
        $data['rows'] = $data_sheet->getRows();
        $data['recordsFiltered'] = $data_sheet->countRowsInDataSource();
        $data['recordsTotal'] = $data_sheet->countRowsInDataSource();
        $data['footer'] = $data_sheet->getTotalsRows();
        return $data;
    }
    
    public function getJsonPropertiesFromUxon(iCanBeConvertedToUxon $object) : array
    {
        $schema = new UxonSchema($this->getWorkbench());
        $className = get_class($object);
        return $schema->getProperties($className);
    }
    
    public function getJsonPropertiesFromAngularInterface(string $workingDir, string $fileName) : array
    {
        $props = [];
        
        $path = $workingDir . DIRECTORY_SEPARATOR . $fileName;
        if (! file_exists($path)) {
            throw new RuntimeException('Angular interface "' . $fileName . '" not found!');
        }
        
        $file = fopen($path,"r");
        try {
            $props = $this->parseAngularInterface($file, $workingDir);
        } catch (\Throwable $e) {
            throw new RuntimeException('Cannot parse Angular interface "' . $fileName . '": ' . $e->getMessage(), null, $e);
        } finally {
            fclose($file);
        }
        
        return $props;
    }
    
    protected function parseAngularInterface($fileStream, string $workingDir) : array
    {
        $props = [];
        $lineNo = 0;
        $imports = [];
        $curlyBracketLevel = 0;
        $squareBracketLevel = 0;
        $commentLevel = 0;
        
        while(! feof($fileStream))
        {
            $line = fgets($fileStream);
            $line = trim($line);
            $lineNo++;
            
            // If the line has a trailing { or [, increase bracket-level and remove the character
            if(StringDataType::endsWith($line, '{')) {
                $curlyBracketLevel++;
                $line = trim($line, "{ \t");
            } elseif (StringDataType::endsWith($line, '[')) {
                $squareBracketLevel++;
                $line = trim($line, "[ \t");
            }
            
            switch (true) {
                case StringDataType::startsWith($line, '/*'):
                    $commentLevel++;
                    continue 2;
                case StringDataType::endsWith($line, '*/'):
                    $commentLevel--;
                    continue 2;
                case $commentLevel > 0:
                case StringDataType::startsWith($line, '//'):
                    continue 2;
                case StringDataType::startsWith($line, 'import'):
                    $importMatches = [];
                    preg_match('/import \\{(.*)\\} from [\'"](.*)[\'"]/', $line, $importMatches);
                    $importInterface = trim($importMatches[1]);
                    $importFile = trim($importMatches[2]);
                    if ($importFile === null || $importInterface === null || $importFile === '' || $importInterface === '') {
                        throw new RuntimeException('Cannot parse import statement on line ' . $lineNo);
                    }
                    if (StringDataType::startsWith($importFile, './')) {
                        $importFile = substr($importFile, 2);
                    }
                    $imports[$importInterface] = $importFile . '.ts';
                    break;
                case StringDataType::startsWith($line, 'export interface'):
                    $extendsMatches = [];
                    preg_match('/extends (.*)/i', $line, $extendsMatches);
                    if ($extendsIterface = trim($extendsMatches[1])) {
                        $importFile = $imports[trim($extendsIterface)];
                        $props = array_merge($props, $this->getJsonPropertiesFromAngularInterface($workingDir, $importFile));
                    }
                    break;
                case $line === '':
                    continue 2;
                case $line === ']':
                    $squareBracketLevel--;
                    break;
                case $line === '}':
                    $curlyBracketLevel--;
                    break;
                default:
                    if ($curlyBracketLevel === 1 && $squareBracketLevel === 0) {
                        $line = rtrim($line, ";,");
                        list ($prop, $val) = explode(':', $line, 2);
                        $val = trim($val);
                        $props[] = $prop;
                    }
            }
        }
        
        if ($curlyBracketLevel > 0) {
            throw new RuntimeException('Missing `}`!');
        }
        
        if ($squareBracketLevel > 0) {
            throw new RuntimeException('Missing `]`!');
        }
        
        return $props;
    }
    
    /**
     *
     * @param WidgetInterface $widget
     * @return string
     */
    public function getAngularInterfaceFileName(string $phpClassname, string $pathToAngularInterfaces, string $angularSuffix = '.interface.ts') : string
    {
        $interface = $this->angularInterfacesByPhpClass[$phpClassname];
        if (null === $interface) {
            $interface = $this->convertPhpClassToAngularInterfaceFilename($phpClassname, $angularSuffix);
            if (! file_exists($pathToAngularInterfaces . DIRECTORY_SEPARATOR . $interface)) {
                $phpClassname = get_parent_class($phpClassname);
                $interface = $this->convertPhpClassToAngularInterfaceFilename($phpClassname, $angularSuffix);
                while (! file_exists($pathToAngularInterfaces . DIRECTORY_SEPARATOR . $interface)) {
                    if ($phpClassname = get_parent_class($phpClassname)) {
                        $interface = $this->convertPhpClassToAngularInterfaceFilename($phpClassname, $angularSuffix);
                    } else {
                        break;
                    }
                }
                
                if (! file_exists($pathToAngularInterfaces . DIRECTORY_SEPARATOR . $interface)) {
                    $interface = $pathToAngularInterfaces . DIRECTORY_SEPARATOR . 'widget.interface.ts';
                }
            }
            $this->angularInterfacesByPhpClass[$phpClassname] = $interface;
        }
        return $interface;
    }
    
    protected function convertPhpClassToAngularInterfaceFilename(string $phpClassname, string $angularSuffix = '.interface.ts') : string
    {
        $phpClass = PhpFilePathDataType::findFileName($phpClassname);
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '-$0', $phpClass)) . $angularSuffix;
    }
}