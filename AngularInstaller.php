<?php
namespace axenox\AngularMaterialFacade;

use exface\Core\CommonLogic\AppInstallers\AbstractAppInstaller;
use axenox\AngularMaterialFacade\Facades\AngularMaterialFacade;
use exface\Core\DataTypes\FilePathDataType;
use exface\Core\DataTypes\UrlDataType;

/**
 * Performs all neccessary operations to make the included angular app work as a facade.
 * 
 * @method AngularMaterialFacadeApp getApp()
 *
 * @author Andrej Kabachnik
 *
 */
class AngularInstaller extends AbstractAppInstaller
{
    private $facade = null;
    
    /**
     *
     * {@inheritDoc}
     * @see \exface\Core\Interfaces\InstallerInterface::install()
     */
    public function install(string $source_absolute_path) : \Iterator
    {
        $indent = $this->getOutputIndentation();
        
        yield from $this->updateAngularDist($this->getFacade(), $indent);
    }
    
    /**
     *
     * {@inheritdoc}
     *
     * @see \exface\Core\Interfaces\InstallerInterface::uninstall()
     */
    public function uninstall() : \Iterator
    {
        yield 'Uninstall not implemented for installer "' . $this->getSelectorInstalling()->getAliasWithNamespace() . '"!';
    }
    
    /**
     *
     * {@inheritdoc}
     *
     * @see \exface\Core\Interfaces\InstallerInterface::backup()
     */
    public function backup(string $destination_absolute_path) : \Iterator
    {
        yield 'Backup not implemented for' . $this->getSelectorInstalling()->getAliasWithNamespace() . '!';
    }
    
    public function setFacade(AngularMaterialFacade $facade) : AngularInstaller
    {
        $this->facade = $facade;
        return $this;
    }
    
    protected function getFacade() : AngularMaterialFacade
    {
        return $this->facade;
    }
    
    /**
     * Replaces the base URL in the index.html of the angular built app.
     * 
     * @param AngularMaterialFacade $facade
     * @param string $indent
     * @return \Iterator
     */
    protected function updateAngularDist(AngularMaterialFacade $facade, string $indent) : \Iterator
    {
        $distPathRelativeToApp = $facade->getConfig()->getOption('ANGULAR.DIST.PATH');
        $baseUrl = $this->getWorkbench()->getUrl();
        if ($baseUrl === '') {
            yield $indent . 'WARNING: Cannot update base url in angular app - no base URL defined for the workbench. Please ensure, that SERVER.BASE_URLS is set in config/System.config.json' . PHP_EOL;
            return;
        }
        $basePath = UrlDataType::findPath($baseUrl);
        $basePath = '/' . ltrim($basePath, "/");
        $baseHref = $basePath . 'vendor/' . FilePathDataType::normalize($this->getApp()->getDirectory(), '/') . '/' . $distPathRelativeToApp;
        $indexHtmlPath = $this->getApp()->getDirectoryAbsolutePath() . DIRECTORY_SEPARATOR . FilePathDataType::normalize($distPathRelativeToApp, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'index.html';
        if (file_exists($indexHtmlPath)) {
            $indexHtml = file_get_contents($indexHtmlPath);
            $indexHtml = preg_replace('/<base href="(.*)">/', '<base href="' . $baseHref . '">', $indexHtml);
            file_put_contents($indexHtmlPath, $indexHtml);
        }
        yield $indent . 'Base URL of angular app set to "' . $baseHref . '".' . PHP_EOL;
    }
}