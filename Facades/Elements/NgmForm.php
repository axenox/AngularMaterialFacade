<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Widgets\Form;
use exface\Core\CommonLogic\DataSheets\DataColumn;

/**
 *
 * @method AngularMaterialFacade getFacade()
 * @method Form getWidget()
 *        
 * @author Andrej Kabachnik
 *        
 */
class NgmForm extends NgmWidgetGrid
{
    
    /**
     * 
     * {@inheritDoc}
     * @see \axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement::buildJsonPropertyValue()
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, $property)
    {
        switch (strtolower($property)) {
            case 'uid_data_column_name': return $this->getUidColumnName();  
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
    
    /**
     * 
     * @return string
     */
    protected function getUidColumnName() : string
    {
        if ($this->getWidget()->getMetaObject()->hasUidAttribute() === false) {
            return '';
        }
        return DataColumn::sanitizeColumnName($this->getWidget()->getMetaObject()->getUidAttributeAlias());
    }
}