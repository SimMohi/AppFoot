<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;

class JWTDecodedListener
{

    /**
     * @param JWTDecodedEvent $event
     *
     * @return void
     */
    public function onJWTDecoded(JWTDecodedEvent $event)
    {
//        $payload = $event->getPayload();
////        $user = 4
////
////        $payload['custom_user_data'] = $user->getCustomUserInformations();
//        //$user = $event->getUser();
//
//
//        $event->setPayload(['$user']); // Don't forget to regive the payload for next event / step
  }
}
