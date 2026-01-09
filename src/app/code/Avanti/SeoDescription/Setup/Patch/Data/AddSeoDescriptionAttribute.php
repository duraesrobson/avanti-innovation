<?php

/**
 * ARQUIVO RESPONSÁVEL PELA CRIAÇÃO DO ATRIBUTO SEO DESCRIPTION
 * NA ENTIDADE DE CATEGORIA (DATA PATCH)
 */

namespace Avanti\SeoDescription\Setup\Patch\Data;

use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;
use Magento\Catalog\Model\Category;
use Magento\Eav\Setup\EavSetupFactory;

/**
 * classe para criacao do atributo customizado de seo para categorias
 */
class AddSeoDescriptionAttribute implements DataPatchInterface
{
    /**
     * @var ModuleDataSetupInterface
     */
    private $moduleDataSetup;

    /**
     * @var EavSetupFactory
     */
    private $eavSetupFactory;

    /**
     * construtor para injetar as dependencias de configuracao e setup eav
     */
    public function __construct(
        ModuleDataSetupInterface $moduleDataSetup,
        EavSetupFactory $eavSetupFactory
    ) {
        $this->moduleDataSetup = $moduleDataSetup;
        $this->eavSetupFactory = $eavSetupFactory;
    }

    /**
     * metodo principal para aplicar a criacao do atributo no banco de dados
     */
    public function apply()
    {
        $eavSetup = $this->eavSetupFactory->create(['setup' => $this->moduleDataSetup]);

        $eavSetup->addAttribute(Category::ENTITY, 'seo_description', [
            'type' => 'text',
            'label' => 'SEO Description (Footer)',
            'input' => 'textarea',
            'required' => false,
            'sort_order' => 100,
            'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
            'group' => 'Content',
            'is_html_allowed_on_front' => true,
            'wysiwyg_enabled' => true,
            'is_used_for_promo_rules' => false,
        ]);
    }

    /**
     * define dependencias de outros patches caso existam
     */
    public static function getDependencies()
    {
        return [];
    }

    /**
     * define apelidos para o patch caso necessario
     */
    public function getAliases()
    {
        return [];
    }
}
