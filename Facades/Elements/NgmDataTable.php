<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Widgets\Data;

/**
 *
 * @method AngularMaterialFacade getFacade()
 * @method Data getWidget()
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
            case 'caption': return $this->getCaption();
            case 'default_search_button_id': return $this->getDefaultSearchButtonId();
            case 'uid_data_column_name': return $this->getUidColumnName();  
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
    
    /**
     * 
     * @return string|NULL
     */
    protected function getDefaultSearchButtonId() : ?string
    {
        foreach ($this->getWidget()->getToolbarMain()->getButtonGroupForSearchActions()->getButtons() as $btn) {
            if ($btn->getActionAlias() === 'exface.Core.RefreshWidget') {
                return $btn->getId();
            }
        }
        return null;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement::getCaption()
     */
    protected function getCaption() : string
    {
        return $this->getWidget()->getCaption() ? $this->getWidget()->getCaption() : $this->getMetaObject()->getName();
    }
    
    /**
     * 
     * @return string
     */
    protected function getUidColumnName() : string
    {
        if ($this->getWidget()->hasUidColumn() === false) {
            return '';
        }
        return $this->getWidget()->getUidColumn()->getDataColumnName();
    }
}