<?php

namespace App\Repository;

use App\Entity\CarPassenger;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method CarPassenger|null find($id, $lockMode = null, $lockVersion = null)
 * @method CarPassenger|null findOneBy(array $criteria, array $orderBy = null)
 * @method CarPassenger[]    findAll()
 * @method CarPassenger[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CarPassengerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CarPassenger::class);
    }

    // /**
    //  * @return CarPassenger[] Returns an array of CarPassenger objects
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
    public function findOneBySomeField($value): ?CarPassenger
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
