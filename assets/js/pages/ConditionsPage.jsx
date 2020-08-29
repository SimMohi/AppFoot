import React from 'react';

const ConditionsPage = props => {
    return(
        <div className={"whiteBorder p-3 container"}>
            <h3>Conditions d'utilisation</h3>
            <p>Bienvenue sur la plateforme de FC Ronvau Chaumont !</p>

            <p>Les présentes conditions d’utilisation régissent votre utilisation et fournissent des informations sur la plateforme, tel que présenté ci-dessous.</p>

            <p>En échange de notre engagement à vous fournir ce service, nous vous demandons de prendre les engagements suivants envers nous.<br/>
                Nous souhaitons que notre service soit sûr, sécurisé et conforme à la loi. <br/>
                Par conséquent, nous avons besoin que vous vous engagiez à respecter quelques restrictions afin de faire partie de la plateforme.</p>
            <ul>
                <li>Vous devez avoir au moins 13 ans.</li>

                <li>Vous ne pouvez pas usurper l’identité d’autrui ni fournir des informations erronées.</li>

                <li>Vous ne pouvez pas usurper l’identité de quelqu’un que vous n’êtes pas et vous ne pouvez pas créer de compte pour une autre personne.</li>

                <li>Vous ne pouvez rien faire qui soit illégal, trompeur ou frauduleux, ni agir dans un but illicite ou interdit.</li>

                <li>Vous ne pouvez rien faire qui interfère avec le fonctionnement prévu du service ou qui nuise à celui-ci.</li>

                <li>En cas de non respect des conditions précédentes, des sanctions pourront être prise comme la suppression du compte.</li>

            </ul>
        </div>
    )
}

export default ConditionsPage;