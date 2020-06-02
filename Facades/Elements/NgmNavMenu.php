<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Widgets\NavMenu;
use axenox\AngularMaterialFacade\Facades\Elements\Traits\NavElementTrait;

/**
 *
 * @method NavMenu getWidget()
 * @author Andrej Kabachnik
 *        
 */
class NgmNavMenu extends NgmBasicElement
{
    use NavElementTrait;
    private $currentPage = null;
    
    /**
     * 
     * {@inheritDoc}
     * @see \axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement::buildJsonPropertyValue()
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, $property)
    {
        switch (strtolower($property)) {
            case 'nav_menu':
                $this->currentPage = $this->getWidget()->getPage();
                $menu = $this->getWidget()->getMenu();
                return $this->buildJsonMenu($menu);
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
}