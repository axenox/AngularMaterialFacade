<?php
namespace axenox\AngularMaterialFacade\Facades\Elements\Actions;

use axenox\AngularMaterialFacade\Facades\Elements\Traits\JsonBuilderTrait;
use exface\Core\Interfaces\Actions\ActionInterface;
use exface\Core\Interfaces\Facades\FacadeInterface;
use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Interfaces\WorkbenchInterface;

/**
 *
 * @method AngularMaterialFacade getFacade()
 *
 * @author Andrej Kabachnik
 *
 */
class NgmActionElement
{
    use JsonBuilderTrait {
        buildJsonPropertyValue as buildJsonPropertyValueViaTrait;
    }
    
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
    
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, string $property)
    {
        switch (true) {
            case $property === 'alias':
                return $this->getAction()->getAliasWithNamespace();
        }
        return $this->buildJsonPropertyValueViaTrait($object, $property);
    }
    
    public function getFacade() : FacadeInterface
    {
        return $this->facade;
    }
    
    public function getAction() : ActionInterface
    {
        return $this->action;
    }
    
    public function getWorkbench() : WorkbenchInterface
    {
        return $this->facade->getWorkbench();
    }
}