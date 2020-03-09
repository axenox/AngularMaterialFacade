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
        $json = [];
        $schema = new UxonSchema($this->getWorkbench());
        $className = get_class($object);
        $uxonProps = $schema->getProperties($className);
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