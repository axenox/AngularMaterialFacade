<?php
namespace axenox\AngularMaterialFacade\Facades\Elements\Traits;

use exface\Core\Interfaces\Model\UiPageTreeNodeInterface;
use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\DataTypes\StringDataType;

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
            case 'icon_set': return $this->buildJsonPropertyValueIconSet($object);
            case 'icon_class':  return $this->buildJsonPropertyValueIconClass($object);
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
    
    protected function buildJsonPropertyValueIconClass(iCanBeConvertedToUxon $object) : string
    {
        $iconSet = $this->buildJsonPropertyValueIconSet($object);
        $icon = $this->getWidget()->getIcon();
        if (! StringDataType::startsWith($icon, $iconSet . '-')) {
            return $iconSet . '-' . $icon;
        } else {
            return $icon;
        }
    }
    
    protected function buildJsonPropertyValueIconSet(iCanBeConvertedToUxon $object) : string
    {
        return array_keys($this->getFacade()->getIconSets())[0];
    }
}