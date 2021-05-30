import Helmet from "react-helmet";
const Seo = () => (      
<Helmet>
    <title>Pokemon Drinking Game</title>
    <meta name="description" content="The Pokemon Drinking Board Game, play with your friends across the world with game rooms and have fun! Please drink responsibly." />
    <meta property="og:type" content="website" />
    <meta name="og:title" property="og:title" content="Pokemon Drinking Game" />
    <meta name="og:description" property="og:description" content="The Pokemon Drinking Board Game, play with your friends across the world with game rooms and have fun! Please drink responsibly." />
    <meta property="og:site_name" content="Pokemon Drinking Game" />
    <meta property="og:url" content="http://www.pkmndrinkinggame.com" />  
    <meta name="twitter:card" content="summary" /> 
    <meta name="twitter:title" content="Pokemon Drinking Game" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:description" content="The Pokemon Drinking Board Game, play with your friends across the world with game rooms and have fun! Please drink responsibly." />
    <meta name="twitter:site" content="http://www.pkmndrinkinggame.com" />
    <meta name="twitter:creator" content="Konnor Beaulier" />
    <link rel="icon" type="image/svg" href="../logo.svg" />
    <link rel="apple-touch-icon" href="../logo.svg" />
    <meta property="og:image" content="../logo.svg" />  
    <meta name="twitter:image" content="../logo.svg" />   
    <link rel="canonical" href="http://www.pkmndrinkinggame.com" />
</Helmet>
)
export default Seo;