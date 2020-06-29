<?php
namespace axenox\AngularMaterialFacade\Facades\Elements\Traits;

use exface\Core\Interfaces\Model\UiPageTreeNodeInterface;
use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\DataTypes\StringDataType;
use exface\Core\Interfaces\Facades\FacadeInterface;
use exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade;

trait IconTrait
{    
    /**
     *
     * {@inheritDoc}
     * @see \axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement::buildJsonPropertyValue()
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, $property)
    {
        switch (strtolower($property)) {
            case 'icon_set': return $this->buildJsonPropertyValueIconSet($object, $this->getFacade());
            case 'icon_class':  return $this->buildJsonPropertyValueIconClass($object, $this->getFacade());
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
    
    protected function buildJsonPropertyValueIconClass(iCanBeConvertedToUxon $object, AbstractAjaxFacade $facade) : string
    {
        $iconSet = $this->buildJsonPropertyValueIconSet($object, $facade);
        $icon = $object->getIcon();
        if (! StringDataType::startsWith($icon, $iconSet . '-')) {
            return $iconSet . '-' . $icon;
        } else {
            return $icon;
        }
    }
    
    protected function buildJsonPropertyValueIconSet(iCanBeConvertedToUxon $object, AbstractAjaxFacade $facade) : string
    {
        return array_keys($facade->getIconSets())[0];
    }
}