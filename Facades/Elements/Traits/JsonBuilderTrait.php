<?php
namespace axenox\AngularMaterialFacade\Facades\Elements\Traits;

use exface\Core\Interfaces\WidgetInterface;
use exface\Core\Interfaces\Actions\ActionInterface;
use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\DataTypes\StringDataType;
use exface\Core\Exceptions\RuntimeException;
use exface\Core\CommonLogic\UxonObject;
use exface\Core\CommonLogic\Filemanager;

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
        $props = $this->buildJsonFromObject($widget);
        $fallbacks = [];
        foreach (class_parents($widget) as $fallbackClass) {
            $widgetType = StringDataType::substringAfter($fallbackClass, '\\', $fallbackClass, false, true);
            $fallbacks[] = $widgetType;
        }
        $props['fallback_widgets'] = $fallbacks;
        return $props;
    }
    
    /**
     *
     * @param ActionInterface $action
     * @return array
     */
    protected function buildJsonFromAction(ActionInterface $action) : array
    {
        $props = $this->buildJsonFromObject($action);
        $fallbacks = [];
        foreach (class_parents($action) as $fallbackClass) {
            $widgetType = StringDataType::substringAfter($fallbackClass, '\\', $fallbackClass, false, true);
            $fallbacks[] = $widgetType;
        }
        $props['fallback_actions'] = $fallbacks;
        return $props;
    }
    
    /**
     * Generic config JSON generator for anything, that has a UXON model.
     *
     * @param iCanBeConvertedToUxon $object
     * @return array
     */
    protected function buildJsonFromObject(iCanBeConvertedToUxon $object) : array
    {
        $json = [];
        $uxonProps = $this->getJsonProperties($object);
        foreach ($uxonProps as $key => $property) {
            if (StringDataType::startsWith($key, '~angular_')) {
                $json[$key] = $property;
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
                return $this->getFacade()->getElementForAction($value)->buildJson();
        }
        return null;
    }
    
    protected function getJsonProperties(iCanBeConvertedToUxon $object) : array
    {
        switch (true) {
            case $object instanceof WidgetInterface:
            case $object instanceof ActionInterface:
                $configNamespace = ($object instanceof WidgetInterface ? 'ANGULAR.INTERFACES.WIDGETS.' : 'ANGULAR.INTERFACES.ACTIONS.');
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