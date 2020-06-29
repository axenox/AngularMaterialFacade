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
use exface\Core\Interfaces\Model\UiPageInterface;
use exface\Core\DataTypes\PhpFilePathDataType;
use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Uxon\UxonSchema;
use exface\Core\Exceptions\RuntimeException;
use exface\Core\DataTypes\StringDataType;
use exface\Core\Interfaces\Actions\ActionInterface;
use axenox\AngularMaterialFacade\Facades\Elements\Actions\NgmActionElement;
use exface\Core\Exceptions\Facades\FacadeRuntimeError;
use function GuzzleHttp\Psr7\stream_for;
use exface\Core\Interfaces\Log\LoggerInterface;
use exface\Core\Widgets\LoginPrompt;
use exface\Core\Factories\UiPageFactory;
use exface\Core\DataTypes\FilePathDataType;
use axenox\AngularMaterialFacade\Facades\Middleware\TableUrlParamsReader;

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
    
    private $jsonPropsByAngularPath = [];
    
    private $themeCss = null;

    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::handle()
     */
    public function handle(ServerRequestInterface $request, $useCacheKey = null) : ResponseInterface
    {
        if ($this->isRequestFrontend($request)) {
            $file = FilePathDataType::findFileName($request->getUri()->getPath(), true);
            if ($file === '' || StringDataType::endsWith($file, '.html', false)) {
                $indexHtmlPath = $this->getApp()->getDirectoryAbsolutePath() 
                . DIRECTORY_SEPARATOR . 'Facades' 
                . DIRECTORY_SEPARATOR . 'Angular'
                . DIRECTORY_SEPARATOR . 'dist'
                . DIRECTORY_SEPARATOR . 'index.html';
                if (! file_exists($indexHtmlPath)) {
                    throw new FacadeRuntimeError('Angular build not found! Please run "ng build" or reinstall the facade');
                }
                return new Response(200, $this->buildHeadersAccessControl(), stream_for(file_get_contents($indexHtmlPath)));
            }
        }
        
        return parent::handle($request, $useCacheKey);
    }

    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::createResponseFromTaskResult()
     */
    protected function createResponseFromTaskResult(ServerRequestInterface $request, ResultInterface $result) : ResponseInterface
    {
        $status_code = $result->getResponseCode();
        $headers = $this->buildHeadersAccessControl();
        
        if ($result->isEmpty()) {
            return new Response($status_code, $headers);
        }
        
        switch (true) {
            case $result instanceof ResultWidgetInterface:
                $widget = $result->getWidget();
                $headers['Content-type'] = ['application/json;charset=utf-8'];
                $json = $this->getElement($widget)->buildJson();
                $body = json_encode($json);
                break;
            default:
                return parent::createResponseFromTaskResult($request, $result);
        }
        
        return new Response($status_code, $headers, $body);
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::createResponseUnauthorized()
     */
    protected function createResponseUnauthorized(ServerRequestInterface $request, \Throwable $exception, UiPageInterface $page = null) : ?ResponseInterface
    {
        $page = ! is_null($page) ? $page : UiPageFactory::createEmpty($this->getWorkbench());
        
        try {
            $loginPrompt = LoginPrompt::createFromException($page, $exception);
        } catch (\Throwable $e) {
            $this->getWorkbench()->getLogger()->logException($e, LoggerInterface::DEBUG);
            return null;
        }
            
        $headers['Content-type'] = ['application/json;charset=utf-8'];
        $headers = array_merge($headers, $this->buildHeadersAccessControl());
        $responseBody = json_encode($this->getElement($loginPrompt)->buildJson());
            
        return new Response(401, $this->buildHeadersAccessControl(), $responseBody);
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::isShowingErrorDetails()
     */
    protected function isShowingErrorDetails() : bool
    {
        return false;
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
        $middleware[] = new TableUrlParamsReader($this, 'getInputData', 'setInputData');
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
    
    public function getJsonPropertiesFromAngularInterface(string $angularPath, string $workingDir) : array
    {
        if (StringDataType::startsWith($angularPath, './')) {
            $angularPath = substr($angularPath, 2);
            $path = $workingDir . DIRECTORY_SEPARATOR . $angularPath;
        } elseif (StringDataType::startsWith($angularPath, 'src/')) {
            $path = $this->getAngularFolderAbsolutePath() . DIRECTORY_SEPARATOR . $angularPath;
        } else {
            $path = $workingDir . DIRECTORY_SEPARATOR . $angularPath;
        }
        
        if ($props = $this->jsonPropsByAngularPath[$path]) {
            return $props;
        }
        
        if (! file_exists($path)) {
            throw new RuntimeException('Angular interface "' . $angularPath . '" not found!');
        }
        
        $file = fopen($path,"r");
        try {
            $props = $this->parseAngularInterface($file, $workingDir);
        } catch (\Throwable $e) {
            throw new RuntimeException('Cannot parse Angular interface "' . $angularPath . '": ' . $e->getMessage(), null, $e);
        } finally {
            fclose($file);
        }
        
        $props['~angular_interface'] = $angularPath;
        
        $this->jsonPropsByAngularPath[$path] = $props;
        
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
                    $importPath = trim($importMatches[2]);
                    if ($importPath === null || $importInterface === null || $importPath === '' || $importInterface === '') {
                        throw new RuntimeException('Cannot parse import statement on line ' . $lineNo);
                    }
                    $imports[$importInterface] = $importPath . '.ts';
                    break;
                case StringDataType::startsWith($line, 'export interface'):
                    $extendsMatches = [];
                    preg_match('/extends (.*)/i', $line, $extendsMatches);
                    if ($extendsIterface = trim($extendsMatches[1])) {
                        $importPath = $imports[trim($extendsIterface)];
                        $props = array_merge($props, $this->getJsonPropertiesFromAngularInterface($importPath, $workingDir));
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
    public function getAngularInterfaceFileName(string $phpClassname, string $pathToAngularInterfaces, string $baseInterface, string $angularSuffix = '.interface.ts') : string
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
                    $interface = $baseInterface;
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
    
    protected function getAngularFolderAbsolutePath() : string
    {
        return $this->getApp()->getDirectoryAbsolutePath() . DIRECTORY_SEPARATOR . 'Facades' . DIRECTORY_SEPARATOR . 'Angular';
    }
    
    public function getElementForAction(ActionInterface $action) : NgmActionElement
    {
        $actionElementClass = $this->getElementClass(get_class($action), 'Actions', 'Actions\\NgmActionElement');
        $actionElement = new $actionElementClass($action, $this);
        return $actionElement;
    }
    
    /**
     * 
     * @param string $coreClassname
     * @param string $subfolder
     * @param string $fallbackElementClass
     * @return string
     */
    protected function getElementClass(string $coreClassname, string $subfolder = '', string $fallbackElementClass = 'NgmBasicElement') : string
    {
        $elem_class = $this->elementClassesByCoreClass[$coreClassname];
        if (is_null($elem_class)) {
            $elem_namespace = $this->getClassNamespace() . '\\Elements\\';
            $elem_class_prefix = $elem_namespace . ($subfolder !== '' ? $subfolder . '\\' : '') . $this->getClassPrefix();
            $coreClass = PhpFilePathDataType::findFileName($coreClassname, false);
            $elem_class = $elem_class_prefix . ucfirst($coreClass);
            if (! class_exists($elem_class)) {
                $widget_class = get_parent_class($coreClassname);
                $elem_class = $elem_class_prefix . ucfirst($coreClass);
                while (! class_exists($elem_class)) {
                    if ($widget_class = get_parent_class($widget_class)) {
                        $elem_class = $elem_class_prefix . ucfirst($coreClass);
                    } else {
                        break;
                    }
                }
                
                if (class_exists($elem_class)) {
                    $reflection = new \ReflectionClass($elem_class);
                    if ($reflection->isAbstract()) {
                        $elem_class = $elem_namespace . $fallbackElementClass;
                    }
                } else {
                    // if the required widget is not found, create an abstract widget instead
                    $elem_class = $elem_namespace . $fallbackElementClass;
                }
            }
            $this->elementClassesByCoreClass[$coreClassname] = $elem_class;
        }
        return $elem_class;
    }
    
    public function getPageTemplateFilePathDefault() : string
    {
        return '';
    }
    
    protected function buildHtmlPage(WidgetInterface $widget, string $pagetTemplateFilePath = null) : string
    {
        return '';
    }

    /**
     * 
     * @return string
     */
    public function getTheme() : string
    {
        return $this->themeCss ?? "@angular/material/prebuilt-themes/deeppurple-amber.css";
    }
    
    /**
     * The theme CSS to use
     * 
     * @uxon-property theme
     * @uxon-type string
     * @uxon-default @angular/material/prebuilt-themes/deeppurple-amber.css
     * 
     * @param string $css
     * @return AngularMaterialFacade
     */
    public function setTheme(string $css) : AngularMaterialFacade
    {
        $this->themeCss = $css;
        return $this;
    }
}