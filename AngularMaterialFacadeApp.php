<?php
namespace axenox\AngularMaterialFacade;

use exface\Core\Interfaces\InstallerInterface;
use exface\Core\Facades\AbstractHttpFacade\HttpFacadeInstaller;
use exface\Core\CommonLogic\Model\App;
use exface\Core\Factories\FacadeFactory;
use exface\ModxCmsConnector\CommonLogic\Installers\ModxCmsTemplateInstaller;
use exface\Core\Interfaces\ConfigurationInterface;
use axenox\AngularMaterialFacade\Facades\AngularMaterialFacade;
use exface\Core\CommonLogic\Filemanager;
use exface\Core\DataTypes\FilePathDataType;

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
        $facade = FacadeFactory::createFromString('axenox.AngularMaterialFacade.AngularMaterialFacade', $this->getWorkbench());
        $tplInstaller->setFacade($facade);
        $installer->addInstaller($tplInstaller);
        
        $angularInstaller = new AngularInstaller($this->getSelector());
        $angularInstaller->setFacade($facade);
        $installer->addInstaller($angularInstaller);
        
        return $installer;
    }
}