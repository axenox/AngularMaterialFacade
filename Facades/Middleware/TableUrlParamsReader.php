<?php
namespace axenox\AngularMaterialFacade\Facades\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use exface\Core\Interfaces\Facades\HttpFacadeInterface;
use exface\Core\Facades\AbstractHttpFacade\Middleware\Traits\TaskRequestTrait;
use exface\Core\Facades\AbstractHttpFacade\Middleware\Traits\DataEnricherTrait;
use exface\Core\Interfaces\Tasks\TaskInterface;
use exface\Core\Interfaces\DataSheets\DataSheetInterface;

/**
 * This PSR-15 middleware reads inline-filters from the URL and passes them to the task
 * in the attributes of the request.
 * 
 * @author Andrej Kabachnik
 *
 */
class TableUrlParamsReader implements MiddlewareInterface
{
    use TaskRequestTrait;
    use DataEnricherTrait;
    
    private $facade = null;
    
    private $taskAttributeName = null;
    
    private $getterMethodName = null;
    
    private $setterMethodName = null;
    
    /**
     * 
     * @param HttpFacadeInterface $facade
     * @param string $dataGetterMethod
     * @param string $dataSetterMethod
     * @param string $taskAttributeName
     */
    public function __construct(HttpFacadeInterface $facade, string $dataGetterMethod, string $dataSetterMethod, $taskAttributeName = 'task')
    {
        $this->facade = $facade;
        $this->taskAttributeName = $taskAttributeName;
        $this->getterMethodName = $dataGetterMethod;
        $this->setterMethodName = $dataSetterMethod;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \Psr\Http\Server\MiddlewareInterface::process()
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $task = $this->getTask($request, $this->taskAttributeName, $this->facade);
        
        $requestParams = $request->getQueryParams();
        if (is_array($request->getParsedBody()) || $request->getParsedBody()) {
            $requestParams = array_merge($requestParams, $request->getParsedBody());
        }
        
        $result = $this->readSortParams($task, $requestParams);
        $result = $this->readPaginationParams($task, $requestParams, $result);
        
        if ($result !== null) {
            $task = $this->updateTask($task, $this->setterMethodName, $result);
            return $handler->handle($request->withAttribute($this->taskAttributeName, $task));
        } else {
            return $handler->handle($request);
        }
    }
    
    /**
     *
     * @param TaskInterface $task
     * @param array $params
     * @param DataSheetInterface $dataSheet
     * @return \exface\Core\Interfaces\DataSheets\DataSheetInterface|NULL
     */
    protected function readSortParams (TaskInterface $task, array $params, DataSheetInterface $dataSheet = null)
    {
        $order = isset($params['order']) ? urldecode($params['order']) : null;
        $sort_cols = isset($params['sort']) ? urldecode($params['sort']) : null;
        $sort_attrs = isset($params['sortAttr']) ? urldecode($params['sortAttr']) : null;
        if (is_null($sort_attrs)) {
            $sort_attrs = $sort_cols;
        }
        if (! is_null($sort_attrs) && ! is_null($order)) {
            $dataSheet = $dataSheet ? $dataSheet : $this->getDataSheet($task, $this->getterMethodName);
            $sort_attrs = explode(',', $sort_attrs);
            $order = explode(',', $order);
            foreach ($sort_attrs as $nr => $sort) {
                $dataSheet->getSorters()->addFromString($sort, $order[$nr]);
            }
            return $dataSheet;
        }
        
        return null;
    }
    
    /**
     * 
     * @param TaskInterface $task
     * @param array $params
     * @param DataSheetInterface $dataSheet
     * @return \exface\Core\Interfaces\DataSheets\DataSheetInterface
     */
    protected function readPaginationParams (TaskInterface $task, array $params, DataSheetInterface $dataSheet = null) 
    {
        if (array_key_exists('length', $params) || array_key_exists('start', $params)) {
            $dataSheet = $dataSheet ? $dataSheet : $this->getDataSheet($task, $this->getterMethodName);
            $dataSheet->setRowsOffset(isset($params['start']) ? intval($params['start']) : 0);
            $dataSheet->setRowsLimit(isset($params['length']) ? intval($params['length']) : 0);
        }
        return $dataSheet;
    }
}