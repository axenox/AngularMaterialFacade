<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement;
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
        $json = [];
        $uxonProps = $this->getJsonProperties($object);
        foreach ($uxonProps as $property) {
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
                return $this->buildJsonFromAction($value);
        }
        return null;
    }
    
    protected function getJsonProperties(iCanBeConvertedToUxon $object) : array
    {
        switch (true) {
            case $object instanceof WidgetInterface:
            case $object instanceof ActionInterface:
                $pathToAngularInterfaces = $this->getFacade()->getConfig()->getOption(($object instanceof WidgetInterface ? 'ANGULAR.INTERFACES.WIDGETS.PATH' : 'ANGULAR.INTERFACES.WIDGETS.PATH'));
                $interfaceDir = Filemanager::pathJoin([
                    $this->getFacade()->getApp()->getDirectoryAbsolutePath(),
                    $pathToAngularInterfaces
                ]);
                $interfaceFile = $this->getFacade()->getAngularInterfaceFileName(get_class($object), $interfaceDir);
                return $this->getFacade()->getJsonPropertiesFromAngularInterface($interfaceFile, $interfaceDir);
            default:
                return $this->getFacade()->getJsonPropertiesFromUxon($object);
        }
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