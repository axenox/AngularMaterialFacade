<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement;
use axenox\AngularMaterialFacade\Facades\Elements\Traits\JsonBuilderTrait;

/**
 *
 * @method AngularMaterialFacade getFacade()
 *
 * @author Andrej Kabachnik
 *
 */
class NgmBasicElement extends AbstractJqueryElement
{
    use JsonBuilderTrait;
    
    public function buildJson() : array
    {
        return $this->buildJsonFromWidget($this->getWidget());
    }
    
    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement::buildJsBusyIconShow()
     */
    public function buildJsBusyIconShow()
    {
        return '';
    }
    
    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement::buildJsBusyIconHide()
     */
    public function buildJsBusyIconHide()
    {
        return '';
    }
    
    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement::buildJs()
     */
    public function buildJs()
    {
        return '';
    }
    
    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement::buildHtml()
     */
    public function buildHtml()
    {
        return '';
    }
}