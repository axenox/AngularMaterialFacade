<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use axenox\AngularMaterialFacade\Facades\Elements\Traits\IconTrait;
use exface\Core\Interfaces\iCanBeConvertedToUxon;

/**
 *
 * @method Button getWidget()
 * @author Andrej Kabachnik
 *        
 */
class NgmButton extends NgmBasicElement
{
    use IconTrait;
    
    /**
     *
     * {@inheritDoc}
     * @see \axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement::buildJsonPropertyValue()
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, $property)
    {
        switch (strtolower($property)) {
            case 'show_icon': return $this->getWidget()->getShowIcon() ?? true;
            case 'icon_set': return $this->buildJsonPropertyValueIconSet($object, $this->getFacade());
            case 'icon_class':  return $this->buildJsonPropertyValueIconClass($object, $this->getFacade());
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
}