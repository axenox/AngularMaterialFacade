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
class NgmDataColumn extends NgmBasicElement
{
    
    /**
     * 
     * {@inheritDoc}
     * @see \axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement::buildJsonPropertyValue()
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, $property)
    {
        switch ($property) {
            case 'sortable':
                return $this->getWidget()->isSortable();
            case 'filterable':
                return $this->getWidget()->isFilterable();
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
}