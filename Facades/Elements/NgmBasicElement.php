<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement;
use exface\Core\Uxon\UxonSchema;
use exface\Core\Factories\WidgetFactory;
use exface\Core\Interfaces\WidgetInterface;
use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\DataTypes\StringDataType;
use exface\Core\CommonLogic\UxonObject;

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
    
    protected function buildJsonFromWidget(WidgetInterface $widget) : array
    {
        return $this->buildJsonFromObject($widget);
    }
    
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
            $getterMethod = 'get' . StringDataType::convertCaseUnderscoreToPascal($property);
            if (method_exists($object, $getterMethod)) {
                try {
                    $val = call_user_func([$object, $getterMethod]);
                } catch (\Throwable $e) {
                    // TODO
                    continue;
                }
                
                if (($value = $this->buildJsonValue($val, $property)) !== null) {
                    $json[$property] = $value;
                }
                
            }
        }
        return $json;
    }
    
    protected function buildJsonValue($value, string $property)
    {
        switch (true) {
            case is_scalar($value):
                return $value;
            case $value instanceof UxonObject:
                $value = $value->toArray();
            case is_array($value): 
                $result = [];
                foreach ($value as $key => $val) {
                    $result[$key] = $this->buildJsonValue($val, $property);
                }
                return $result;
            case $value instanceof WidgetInterface:
                return $this->buildJsonFromWidget($value);
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