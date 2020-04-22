<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Facades\AbstractAjaxFacade\Elements\JqueryInputValidationTrait;
use exface\Core\Widgets\Input;

/**
 *
 * @method AngularMaterialFacade getFacade()
 * @method Input getWidget()
 *        
 * @author Andrej Kabachnik
 *        
 */
class NgmInput extends NgmBasicElement
{
    use JqueryInputValidationTrait;
    
    /**
     * 
     * {@inheritDoc}
     * @see \axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement::buildJsonPropertyValue()
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, $property)
    {
        switch (strtolower($property)) {
            case 'validation_error_text': return $this->getValidationErrorText();  
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
}