<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Interfaces\iCanBeConvertedToUxon;
use exface\Core\Interfaces\Widgets\iLayoutWidgets;

/**
 *
 * @method \exface\Core\Widgets\WidgetGrid getWidget()
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
        // If there is no explicitly defined column number, try to determine one automatically
        if ($colNum === null) {
            // See if there is a config key like WIDGET.PANEL.COLUMNS_IN_GRID_BY_DEFAULT
            $config = $this->getFacade()->getConfig();
            $configKey = 'WIDGET.' . strtoupper($this->getWidget()->getWidgetType()) . '.COLUMNS_IN_GRID_BY_DEFAULT';
            if ($config->hasOption($configKey)) {
                // If there is a config key, use it
                $colNum = $config->getOption($configKey);
            } else {
                // Otherwise look for a config key up the widget hierarchy
                foreach ($this->getFallbackWidgetTypes($this->getWidget()) as $fallbackType) {
                    $configKey = 'WIDGET.' . strtoupper($fallbackType) . '.COLUMNS_IN_GRID_BY_DEFAULT';
                    if ($config->hasOption($configKey)) {
                        $colNum = $config->getOption($configKey);
                    }
                }
            }
            
            // See if there is another grid up the widget hierarchy. If so and it has an explicitly
            // defined number of columns, make sure, this grid does not get more column: e.g.
            // if the parent already has `columns_in_grid` = `1` the auto-value for this grid
            // should be at most one. Therwise it will look squeezed.
            if ($parentGrid = $this->getWidget()->getParentByClass(iLayoutWidgets::class)) {
                $colNumParent = $parentGrid->getColumnsInGrid();
                if ($colNumParent !== null) {
                    $colNum = min($colNumParent, $colNum);
                }
            }
        }
        return $colNum ?? 1;
    }
}