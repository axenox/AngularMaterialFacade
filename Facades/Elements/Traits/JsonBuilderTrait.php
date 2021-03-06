<?php
namespace axenox\AngularMaterialFacade\Facades\Elements\Traits;

use exface\Core\Interfaces\WidgetInterface;
use exface\Core\Interfaces\Actions\ActionInterface;
use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\DataTypes\StringDataType;
use exface\Core\Exceptions\RuntimeException;
use exface\Core\CommonLogic\UxonObject;
use exface\Core\CommonLogic\Filemanager;
use exface\Core\Factories\ActionFactory;
use exface\Core\Interfaces\Selectors\SelectorInterface;
use exface\Core\Interfaces\DataTypes\DataTypeInterface;
use axenox\AngularMaterialFacade\Facades\AngularMaterialFacade;
use exface\Core\Factories\DataTypeFactory;

/**
 * 
 * 
 * @method AngularMaterialFacade getFacade()
 * 
 * @author Andrej Kabachnik
 *
 */
trait JsonBuilderTrait
{
    public abstract function buildJson() : array;
    
    /**
     *
     * @param WidgetInterface $widget
     * @return array
     */
    protected function buildJsonFromWidget(WidgetInterface $widget) : array
    {
        $props = [];
        $props['fallback_widgets'] = $this->getFallbackWidgetTypes($widget);
        if ($widget->getPage()->hasModel()) {
            $props['page_alias'] = $widget->getPage()->getAliasWithNamespace();
        } else {
            $props['page_alias'] = '';
        }
        $props = $this->buildJsonFromObject($widget, $props);
        return $props;
    }
    
    /**
     * 
     * @param WidgetInterface $widget
     * @return string[]
     */
    protected function getFallbackWidgetTypes(WidgetInterface $widget) : array
    {
        $fallbacks = [];
        foreach (class_parents($widget) as $fallbackClass) {
            $widgetType = StringDataType::substringAfter($fallbackClass, '\\', $fallbackClass, false, true);
            if ($widgetType === 'AbstractWidget') {
                break;
            }
            $reflection = new \ReflectionClass($fallbackClass);
            if ($reflection->isAbstract()) {
                continue;
            }
            $fallbacks[] = $widgetType;
        }
        return $fallbacks;
    }
    
    /**
     *
     * @param ActionInterface $action
     * @return string[]
     */
    protected function buildJsonFromAction(ActionInterface $action) : array
    {
        $props = [];
        $props['fallback_actions'] = $this->getFallbackActionAliases($action, $props);
        $props = $this->buildJsonFromObject($action, $props);
        return $props;
    }
    
    /**
     * 
     * @param ActionInterface $action
     * @return array
     */
    protected function getFallbackActionAliases(ActionInterface $action) : array
    {
        $fallbacks = [];
        // Use the current class as fallback too because actions from the metamodel
        // (object actions) have a different alias than their prototype action.
        $classes = array_merge([get_class($action)], class_parents($action));
        foreach ($classes as $fallbackClass) {
            if (StringDataType::endsWith($fallbackClass, 'AbstractAction')) {
                break;
            }
            $reflection = new \ReflectionClass($fallbackClass);
            if ($reflection->isAbstract()) {
                continue;
            }
            $action = ActionFactory::createFromString($this->getWorkbench(), '\\' . $fallbackClass);
            $fallbacks[] = $action->getAliasWithNamespace();
        }
        return $fallbacks;
    }
    
    /**
     * 
     * @param DataTypeInterface $dataType
     * @return array
     */
    protected function buildJsonFromDataType(DataTypeInterface $dataType) : array
    {
        $props = [];
        $props['fallback_types'] = $this->getFallbackDataTypeAliases($dataType, $props);
        $props = $this->buildJsonFromObject($dataType, $props);
        return $props;
    }
    
    /**
     * 
     * @param DataTypeInterface $dataType
     * @return string[]
     */
    protected function getFallbackDataTypeAliases(DataTypeInterface $dataType) : array
    {
        $fallbacks = [];
        // Use the current class as fallback too because actions from the metamodel
        // (object actions) have a different alias than their prototype action.
        $classes = array_merge([get_class($dataType)], class_parents($dataType));
        foreach ($classes as $fallbackClass) {
            if (StringDataType::endsWith($fallbackClass, 'AbstractDataType')) {
                break;
            }
            $reflection = new \ReflectionClass($fallbackClass);
            if ($reflection->isAbstract()) {
                continue;
            }
            $dataType = DataTypeFactory::createFromString($this->getWorkbench(), '\\' . $fallbackClass);
            $fallbacks[] = $dataType->getAliasWithNamespace();
        }
        return $fallbacks;
    }
    
    /**
     * Generic config JSON generator for anything, that has a UXON model.
     *
     * @param iCanBeConvertedToUxon $object
     * @param array $staticProperties
     * @return array
     */
    protected function buildJsonFromObject(iCanBeConvertedToUxon $object, array $staticProperties = []) : array
    {
        $json = $staticProperties;
        $uxonProps = $this->getJsonProperties($object);
        foreach ($uxonProps as $key => $property) {
            if (is_numeric($key) === false && StringDataType::startsWith($key, '~angular_')) {
                $json[$key] = $property;
                continue;
            }
            if ($json[$property] !== null) {
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
        switch (true) {
            case $property === 'object_alias':
                return $object->getMetaObject()->getAliasWithNamespace();
        }
        return $this->buildJsonPropertyValueViaGetter($object, $property);
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
        $getterMethod = 'is' . StringDataType::convertCaseUnderscoreToPascal($property);
        if (method_exists($object, $getterMethod)) {
            $val = call_user_func([$object, $getterMethod]);
            return $this->buildJsonValue($val);
        }
        throw new RuntimeException('Cannot get UXON property "' . $property . '" of class "' . get_class($object) . '"!');
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
                return $this->getFacade()->getElementForAction($value)->buildJson();
            case $value instanceof DataTypeInterface:
                return $this->getFacade()->getElementForDataType($value)->buildJson();
            case $value instanceof SelectorInterface:
                return $value->toString();
        }
        return null;
    }
    
    protected function getJsonProperties(iCanBeConvertedToUxon $object) : array
    {
        switch (true) {
            case $object instanceof WidgetInterface:
            case $object instanceof ActionInterface:
            case $object instanceof DataTypeInterface:
                switch (true) {
                    case $object instanceof WidgetInterface: $configNamespace = 'ANGULAR.INTERFACES.WIDGETS.'; break;
                    case $object instanceof ActionInterface: $configNamespace = 'ANGULAR.INTERFACES.ACTIONS.'; break;
                    case $object instanceof DataTypeInterface: $configNamespace = 'ANGULAR.INTERFACES.DATATYPES.'; break;
                }
                $pathToAngularInterfaces = $this->getFacade()->getConfig()->getOption($configNamespace . 'PATH');
                $baseInterface = $this->getFacade()->getConfig()->getOption($configNamespace . 'BASE_INTERFACE');
                $interfaceDir = Filemanager::pathJoin([
                    $this->getFacade()->getApp()->getDirectoryAbsolutePath(),
                    $pathToAngularInterfaces
                ]);
                $interfaceFile = $this->getFacade()->getAngularInterfaceFileName(get_class($object), $interfaceDir, $baseInterface);
                return $this->getFacade()->getJsonPropertiesFromAngularInterface($interfaceFile, $interfaceDir);
            default:
                return $this->getFacade()->getJsonPropertiesFromUxon($object);
        }
    }
}