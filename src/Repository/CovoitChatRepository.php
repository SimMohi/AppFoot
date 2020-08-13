<?php

namespace App\Repository;

use App\Entity\CovoitChat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CovoitChat|null find($id, $lockMode = null, $lockVersion = null)
 * @method CovoitChat|null findOneBy(array $criteria, array $orderBy = null)
 * @method CovoitChat[]    findAll()
 * @method CovoitChat[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CovoitChatRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CovoitChat::class);
    }

    // /**
    //  * @return CovoitChat[] Returns an array of CovoitChat objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CovoitChat
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
