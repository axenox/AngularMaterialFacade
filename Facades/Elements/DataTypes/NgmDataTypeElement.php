<?php
namespace axenox\AngularMaterialFacade\Facades\Elements\DataTypes;

use axenox\AngularMaterialFacade\Facades\Elements\Traits\JsonBuilderTrait;
use exface\Core\Interfaces\Facades\FacadeInterface;
use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Interfaces\WorkbenchInterface;
use exface\Core\Interfaces\DataTypes\DataTypeInterface;

/**
 *
 * @method AngularMaterialFacade getFacade()
 *
 * @author Andrej Kabachnik
 *
 */
class NgmDataTypeElement
{
    use JsonBuilderTrait {
        buildJsonPropertyValue as buildJsonPropertyValueViaTrait;
    }
    
    private $dataType = null;
    
    private $facade = null;
    
    public function __construct(DataTypeInterface $dataType, FacadeInterface $facade)
    {
        $this->dataType = $dataType;
        $this->facade = $facade;
    }
    
    /**
     * 
     * @return string[]
     */
    public function buildJson() : array
    {
        return $this->buildJsonFromDataType($this->getDataType());
    }
    
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, string $property)
    {
        switch (true) {
            case $property === 'alias':
                return $this->getDataType()->getAliasWithNamespace();
        }
        return $this->buildJsonPropertyValueViaTrait($object, $property);
    }
    
    public function getFacade() : FacadeInterface
    {
        return $this->facade;
    }
    
    public function getDataType() : DataTypeInterface
    {
        return $this->dataType;
    }
    
    public function getWorkbench() : WorkbenchInterface
    {
        return $this->facade->getWorkbench();
    }
}