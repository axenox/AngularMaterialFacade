<?php
namespace axenox\AngularMaterialFacade\Facades\Elements\Traits;

use exface\Core\Interfaces\Model\UiPageTreeNodeInterface;

trait NavElementTrait
{
    /**
     * 
     * @param UiPageTreeNodeInterface[] $nodes
     * @param int $level
     * @return array
     */
    protected function buildJsonMenu(array $nodes, int $level = 1) : array
    {
        $arr = [];
        foreach ($nodes as $node) {
            $url = $this->getFacade()->buildUrlToPage($node->getPageAlias());
            $nodeJson = [
                'level' => $level,
                'name' => $node->getName(),
                'page_alias' => $node->getPageAlias(),
                'url' => $url
            ];
            if ($node->hasChildNodes()) {
                $nodeJson['children'] = $this->buildJsonMenu($node->getChildNodes(), $level+1);
            }
            $arr[] = $nodeJson;
        }
        return $arr;
    }
}