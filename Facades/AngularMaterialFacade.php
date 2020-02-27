<?php
namespace axenox\AngularMaterialFacade\Facades;

use exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade;
use exface\Core\Facades\AbstractAjaxFacade\Middleware\JqueryDataTablesUrlParamsReader;
use exface\Core\Interfaces\DataSheets\DataSheetInterface;
use exface\Core\Interfaces\WidgetInterface;
use Psr\Http\Message\ServerRequestInterface;
use exface\Core\Interfaces\Tasks\ResultInterface;
use Psr\Http\Message\ResponseInterface;
use GuzzleHttp\Psr7\Response;
use exface\Core\Interfaces\Tasks\ResultWidgetInterface;
use axenox\AngularMaterialFacade\Facades\Elements\NgmBasicElement;

/**
 * 
 * @author Andrej Kabachnik
 * 
 * @method NgmBasicElement getElement()
 *
 */
class AngularMaterialFacade extends AbstractAjaxFacade
{

    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::createResponseFromTaskResult()
     */
    protected function createResponseFromTaskResult(ServerRequestInterface $request, ResultInterface $result) : ResponseInterface
    {
        $status_code = $result->getResponseCode();
        $headers = [];
        
        if ($result->isEmpty()) {
            return new Response($status_code);
        }
        
        switch (true) {
            case $result instanceof ResultWidgetInterface:
                $widget = $result->getWidget();
                $headers['Content-type'] = ['application/json;charset=utf-8'];
                $body = json_encode($this->getElement($widget)->buildJson());
                break;
            default:
                return parent::createResponseFromTaskResult($request, $result);
        }
        
        $headers = array_merge($headers, $this->buildHeadersAccessControl());
        return new Response($status_code, $headers, $body);
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::init()
     */
    public function init()
    {
        parent::init();
        $this->setClassPrefix('Ngm');
        $this->setClassNamespace(__NAMESPACE__);
    }
    
    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::getMiddleware()
     */
    protected function getMiddleware() : array
    {
        $middleware = parent::getMiddleware();
        $middleware[] = new JqueryDataTablesUrlParamsReader($this, 'getInputData', 'setInputData');
        return $middleware;
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Interfaces\Facades\HttpFacadeInterface::getUrlRoutePatterns()
     */
    public function getUrlRoutePatterns() : array
    {
        return [
            "/\/api\/angular[\/?]/"
        ];
    }
    
    /**
     * 
     * {@inheritDoc}
     * @see \exface\Core\Facades\AbstractAjaxFacade\AbstractAjaxFacade::buildResponseData()
     */
    public function buildResponseData(DataSheetInterface $data_sheet, WidgetInterface $widget = null)
    {
        $data = array();
        $data['rows'] = $data_sheet->getRows();
        $data['recordsFiltered'] = $data_sheet->countRowsInDataSource();
        $data['recordsTotal'] = $data_sheet->countRowsInDataSource();
        $data['footer'] = $data_sheet->getTotalsRows();
        return $data;
    }
}