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
class NgmDataPaginator extends NgmBasicElement
{
    
    /**
     * 
     * {@inheritDoc}
     * @see \axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement::buildJsonPropertyValue()
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, $property)
    {
        switch ($property) {
            case 'page_size':
                return $this->getFacade()->getConfig()->getOption('WIDGET.DATATABLE.PAGE_SIZE');
            case 'page_sizes':
                return $this->getFacade()->getConfig()->getOption('WIDGET.DATATABLE.PAGE_SIZES_SELECTABLE')->toArray();
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
}