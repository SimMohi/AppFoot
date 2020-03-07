<?php

namespace App\Doctrine;

use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;

class CurrentUserExtend implements QueryCollectionExtensionInterface, QueryItemExtensionInterface{

    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, 
    ?string $operationName = null)
    {
        $user = $this->security->getUser();
    }

    public function applyToItem(QueryBuilder $queryBuilder,QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, 
    array $identifiers, ?string $operationName = null, array $context = [])
    {
        
    }
}