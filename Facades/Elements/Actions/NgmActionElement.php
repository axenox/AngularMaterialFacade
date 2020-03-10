<?php
namespace axenox\AngularMaterialFacade\Facades\Elements\Actions;

use exface\Core\Facades\AbstractAjaxFacade\Elements\AbstractJqueryElement;
use axenox\AngularMaterialFacade\Facades\Elements\Traits\JsonBuilderTrait;
use axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement;
use exface\Core\Interfaces\Actions\ActionInterface;
use exface\Core\Interfaces\Facades\FacadeInterface;

/**
 *
 * @method AngularMaterialFacade getFacade()
 *
 * @author Andrej Kabachnik
 *
 */
class NgmActionElement
{
    use JsonBuilderTrait;
    
    private $action = null;
    
    private $facade = null;
    
    public function __construct(ActionInterface $action, FacadeInterface $facade)
    {
        $this->action = $action;
        $this->facade = $facade;
    }
    
    public function buildJson() : array
    {
        return $this->buildJsonFromAction($this->getAction());
    }
    
    public function getFacade() : FacadeInterface
    {
        return $this->facade;
    }
    
    public function getAction() : ActionInterface
    {
        return $this->action;
    }
}