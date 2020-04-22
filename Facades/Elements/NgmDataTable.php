<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Interfaces\iCanBeConvertedToUxon;

/**
 *
 * @method AngularMaterialFacade getFacade()
 *        
 * @author Andrej Kabachnik
 *        
 */
class NgmDataTable extends NgmBasicElement
{
    
    /**
     * 
     * {@inheritDoc}
     * @see \axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement::buildJsonPropertyValue()
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, $property)
    {
        switch (strtolower($property)) {
            case 'caption':
                return $this->getWidget()->getCaption() ? $this->getWidget()->getCaption() : $this->getMetaObject()->getName();
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
}