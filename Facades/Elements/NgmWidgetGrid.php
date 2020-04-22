<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Widgets\WidgetGrid;

/**
 *
 * @method WidgetGrid getWidget()
 * @author Andrej Kabachnik
 *        
 */
class NgmWidgetGrid extends NgmBasicElement
{
    
    /**
     * 
     * {@inheritDoc}
     * @see \axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement::buildJsonPropertyValue()
     */
    protected function buildJsonPropertyValue(iCanBeConvertedToUxon $object, $property)
    {
        switch (strtolower($property)) {
            case 'columns_in_grid':
                return $this->getColumnsInGrid();
        }
        return parent::buildJsonPropertyValue($object, $property);
    }
    
    /**
     * 
     * @return int
     */
    protected function getColumnsInGrid() : int
    {
        $colNum = $this->getWidget()->getColumnsInGrid();
        if ($colNum === null) {
            $config = $this->getFacade()->getConfig();
            $configKey = 'WIDGET.' . strtoupper($this->getWidget()->getWidgetType()) . '.COLUMNS_IN_GRID_BY_DEFAULT';
            if ($config->hasOption($configKey)) {
                $colNum = $config->getOption($configKey);
            } else {
                foreach ($this->getFallbackWidgetTypes($this->getWidget()) as $fallbackType) {
                    $configKey = 'WIDGET.' . strtoupper($fallbackType) . '.COLUMNS_IN_GRID_BY_DEFAULT';
                    if ($config->hasOption($configKey)) {
                        $colNum = $config->getOption($configKey);
                    }
                }
            }
        }
        return $colNum ?? 1;
    }
}