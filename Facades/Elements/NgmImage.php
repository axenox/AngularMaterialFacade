<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Facades\AbstractAjaxFacade\Elements\JqueryInputValidationTrait;
use exface\Core\Widgets\Image;
use exface\Core\DataTypes\UrlDataType;

/**
 *
 * @method AngularMaterialFacade getFacade()
 * @method Image getWidget()
 *        
 * @author Andrej Kabachnik
 *        
 */
class NgmImage extends NgmBasicElement
{
    /**
     * 
     * {@inheritDoc}
     * @see \axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement::buildJsonPropertyValue()
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, $property)
    {
        switch (strtolower($property)) {
            case 'base_url_absolute': 
                $url = $object->getBaseUrl();
                if (! UrlDataType::isAbsolute($url)) {
                    $url = $this->getWorkbench()->getUrl() . $url;
                }
                return $url;  
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
}