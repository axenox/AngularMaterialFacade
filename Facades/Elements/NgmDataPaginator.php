<?php
namespace axenox\AngularMaterialFacade\Facades\Elements;

use exface\Core\Interfaces\iCanBeConvertedToUxon;

/**
 *
 * @method AngularMaterialFacade getFacade()
 *        
 * @author Andrej Kabachnik
 *        
 */
class NgmDataPaginator extends NgmBasicElement
{
    protected function buildJsonFromObject(iCanBeConvertedToUxon $object) : array
    {
        return [
            'page_size' => 40,
            'page_sizes' => [40, 60]
        ];
    }
}