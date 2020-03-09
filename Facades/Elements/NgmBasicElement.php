<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement;
use exface\Core\Uxon\UxonSchema;
use exface\Core\Factories\WidgetFactory;
use exface\Core\Interfaces\WidgetInterface;
use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\DataTypes\StringDataType;
use exface\Core\CommonLogic\UxonObject;
use exface\Core\Interfaces\Actions\ActionInterface;
use exface\Core\Exceptions\RuntimeException;
use exface\Core\CommonLogic\Filemanager;

/**
 *
 * @method AngularMaterialFacade getFacade()
 *
 * @author Andrej Kabachnik
 *
 */
class NgmBasicElement extends AbstractJqueryElement
{
    public function buildJson() : array
    {
        return $this->buildJsonFromWidget($this->getWidget());
    }
    
    /**
     * 
     * @param WidgetInterface $widget
     * @return array
     */
    protected function buildJsonFromWidget(WidgetInterface $widget) : array
    {
        $json = $this->buildJsonFromObject($widget);
        $json['object_alias'] = $widget->getMetaObject()->getAliasWithNamespace();
        return $json;
    }
    
    /**
     * 
     * @param ActionInterface $action
     * @return array
     */
    protected function buildJsonFromAction(ActionInterface $action) : array
    {
        return [
            'alias' => $action->getAliasWithNamespace(),
            'object_alias' => $action->getMetaObject()->getAliasWithNamespace()
        ];
    }
    
    /**
     * Generic config JSON generator for anything, that has a UXON model.
     * 
     * @param iCanBeConvertedToUxon $object
     * @return array
     */
    protected function buildJsonFromObject(iCanBeConvertedToUxon $object) : array
    {
        $json = [];#
        $uxonProps = $this->getJsonProperties($object);
        $excludedProps = $this->getJsonExcludeProperties();
        foreach ($uxonProps as $property) {
            if (in_array($property, $excludedProps)) {
                continue;
            }
            if (($value = $this->buildJsonPropertyValue($object, $property)) !== null) {
                $json[$property] = $value;
            }
        }
        return $json;
    }
    
    /**
     * 
     * @param iCanBeConvertedToUxon $object
     * @param string $property
     * @return NULL|array|string
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, string $property)
    {
        try {
            return $this->buildJsonPropertyValueViaGetter($object, $property);
        } catch (\Throwable $e) {
            // TODO
            return null;
        }
    }
    
    /**
     *
     * @param iCanBeConvertedToUxon $object
     * @param string $property
     * @return NULL|array|string
     */
    protected function buildJsonPropertyValueViaGetter(iCanBeConvertedToUxon $object, string $property)
    {
        $getterMethod = 'get' . StringDataType::convertCaseUnderscoreToPascal($property);
        if (method_exists($object, $getterMethod)) {
            $val = call_user_func([$object, $getterMethod]);
            return $this->buildJsonValue($val);
        }
        throw new RuntimeException('Cannot get UXON property "' . $property . '" of class "' . get_class($object) . '" via getter-method: method "' . $getterMethod . '()" not found!');
    }
    
    /**
     * 
     * @param string|array|object $value
     * @return NULL|array|string
     */
    protected function buildJsonValue($value)
    {
        switch (true) {
            case is_scalar($value):
                return $value;
            case $value instanceof UxonObject:
                $value = $value->toArray();
            case is_array($value):
                $result = [];
                foreach ($value as $key => $val) {
                    $result[$key] = $this->buildJsonValue($val);
                }
                return $result;
            case $value instanceof WidgetInterface:
                return $this->getFacade()->getElement($value)->buildJson();
            case $value instanceof ActionInterface:
                return $this->buildJsonFromAction($value);
        }
        return null;
    }
    
    protected function getJsonExcludeProperties() : array
    {
        return [];
    }
    
    protected function getJsonProperties(iCanBeConvertedToUxon $object) : array
    {
        switch (true) {
            case $object instanceof WidgetInterface:
                $pathToAngularInterfaces = $this->getFacade()->getConfig()->getOption('ANGULAR.INTERFACES.WIDGETS.PATH');
                $interfaceFile = strtolower(preg_replace('/(?<!^)[A-Z]/', '-$0', $object->getWidgetType())) . '.interface.ts';
                $interfaceDir = Filemanager::pathJoin([
                    $this->getFacade()->getApp()->getDirectoryAbsolutePath(),
                    $pathToAngularInterfaces
                ]);
                return $this->getJsonPropertiesFromAngularInterface($interfaceDir, $interfaceFile);
            case $object instanceof ActionInterface:
                $pathToAngularInterfaces = $this->getFacade()->getConfig()->getOption('ANGULAR.INTERFACES.ACTIONS.PATH');
                $interfaceFile = strtolower(preg_replace('/(?<!^)[A-Z]/', '-$0', $object->getAlias())) . '.interface.ts';
                $interfaceDir = Filemanager::pathJoin([
                    $this->getFacade()->getApp()->getDirectoryAbsolutePath(),
                    $pathToAngularInterfaces
                ]);
                return $this->getJsonPropertiesFromAngularInterface($interfaceDir, $interfaceFile);
            default:
                return $this->getJsonPropertiesFromUxon($object);
        }
    }
    
    protected function getJsonPropertiesFromUxon(iCanBeConvertedToUxon $object) : array
    {
        $schema = new UxonSchema($this->getWorkbench());
        $className = get_class($object);
        return $schema->getProperties($className);
    }
    
    protected function getJsonPropertiesFromAngularInterface(string $workingDir, string $fileName) : array
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
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement::buildJsBusyIconShow()
     */
    public function buildJsBusyIconShow()
    {
        return '';
    }
    
    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement::buildJsBusyIconHide()
     */
    public function buildJsBusyIconHide()
    {
        return '';
    }
    
    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement::buildJs()
     */
    public function buildJs()
    {
        return '';
    }
    
    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement::buildHtml()
     */
    public function buildHtml()
    {
        return '';
    }
}