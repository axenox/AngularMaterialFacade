<?php
namespace axenox\AngularMaterialFacade\Actions;

use exface\Core\CommonLogic\AbstractAction;
use exface\Core\Interfaces\DataSources\DataTransactionInterface;
use exface\Core\Interfaces\Tasks\ResultInterface;
use exface\Core\Interfaces\Tasks\TaskInterface;
use exface\Core\Factories\ResultFactory;
use axenox\AngularMaterialFacade\Facades\AngularMaterialFacade;
use exface\Core\Factories\UiPageFactory;
use exface\Core\Widgets\ContextBar;
use exface\Core\Interfaces\Widgets\iContainOtherWidgets;
use exface\Core\Factories\WidgetFactory;
use exface\Core\Interfaces\Model\UiPageInterface;
use exface\Core\CommonLogic\UxonObject;
use axenox\AngularMaterialFacade\Facades\Elements\Traits\IconTrait;

class ShowShell extends AbstractAction
{
    use IconTrait;
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\CommonLogic\AbstractAction::perform()
     */
    protected function perform(TaskInterface $task, DataTransactionInterface $transaction): ResultInterface
    {
        $page = $this->getPage($task);
        
        $facade = $task->getFacade();
        if ($facade instanceof AngularMaterialFacade) {
            $theme = $facade->getTheme();
        } else {
            $theme = "@angular/material/prebuilt-themes/deeppurple-amber.css";
        }
        
        $array = [
            "theme" => $theme,
            "top_bar" => [
                "caption" => $this->getWorkbench()->getConfig()->getOption('SERVER.TITLE')
            ],
            "context_bar" => $this->buildJsonContextBarData($page->getContextBar(), $facade),
            "navigation_drawer" => $facade->getElement($this->getNavDrawerWidget($page))->buildJson(),
            "secondary_drawer" => [
            
            ]
        ];
        
        return ResultFactory::createJSONResult($task, $array);
    }
    
    /**
     * 
     * @param TaskInterface $task
     * @return UiPageInterface
     */
    protected function getPage(TaskInterface $task) : UiPageInterface
    {
        if ($task->isTriggeredOnPage()) {
            $page = $task->getPageTriggeredOn();
        } else {
            $page = UiPageFactory::createEmpty($this->getWorkbench());
        }
        
        return $page;
    }
    
    /**
     * 
     * @param UiPageInterface $page
     * @return iContainOtherWidgets
     */
    protected function getNavDrawerWidget(UiPageInterface $page) : iContainOtherWidgets
    {
        $container = WidgetFactory::createFromUxon($page, new UxonObject([
            'widget_type' => 'Container',
            'object_alias' => 'exface.Core.PAGE'
        ]));
        $navMenu = WidgetFactory::createFromUxonInParent($container, new UxonObject([
            'widget_type' => 'NavMenu',
            'expand_all' => true
        ]));
        
        $container->addWidget($navMenu);
        return $container;
    }
    
    /**
     * 
     * @param ContextBar $widget
     * @param AngularMaterialFacade $facade
     * @return array
     */
    protected function buildJsonContextBarData(ContextBar $widget, AngularMaterialFacade $facade) : array
    {
        $extra = [];
        try {
            foreach (array_reverse($widget->getButtons()) as $btn){
                $btn_element = $facade->getElement($btn);
                $context = $widget->getContextForButton($btn);
                $extra[$btn_element->getId()] = [
                    'visibility' => $context->getVisibility(),
                    'icon' => $btn->getIcon(),
                    'icon_class' => $this->buildJsonPropertyValueIconClass($btn, $facade),
                    'icon_set' => $this->buildJsonPropertyValueIconSet($btn, $facade),
                    'color' => $context->getColor(),
                    'hint' => $btn->getHint(),
                    'indicator' => ! is_null($context->getIndicator()) ? $widget->getContextForButton($btn)->getIndicator() : '',
                    'bar_widget_id' => $btn->getId()
                ];
            }
        } catch (\Throwable $e){
            $this->getWorkbench()->getLogger()->logException($e);
        }
        return $extra;
    }    
}