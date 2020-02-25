<?php
namespace axenox\AngularMaterialFacade;

use exface\Core\Interfaces\InstallerInterface;
use exface\Core\Facades\AbstractHttpFacade\HttpFacadeInstaller;
use exface\Core\CommonLogic\Model\App;
use exface\Core\Factories\FacadeFactory;
use exface\ModxCmsConnector\CommonLogic\Installers\ModxCmsTemplateInstaller;

class AngularMaterialFacadeApp extends App
{
    private $exportPath = null;
    
    /**
     * {@inheritdoc}
     * 
     * An additional installer is included to condigure the routing for the HTTP facades.
     * 
     * @see App::getInstaller($injected_installer)
     */
    public function getInstaller(InstallerInterface $injected_installer = null)
    {
        $installer = parent::getInstaller($injected_installer);
        
        // Install routes
        $tplInstaller = new HttpFacadeInstaller($this->getSelector());
        $tplInstaller->setFacade(FacadeFactory::createFromString('axenox.AngularMaterialFacade.AngularMaterialFacade', $this->getWorkbench()));
        $installer->addInstaller($tplInstaller);
        
        return $installer;
    }
}