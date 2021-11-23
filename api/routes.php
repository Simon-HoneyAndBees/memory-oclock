<?php
require_once './connect.php';

//initialisation de l'objet connect
$c = new ConnectMemory("server", "user", "password", "memory");

if (isset($_GET["method"])) {
    switch ($_GET["method"]) {
        case "save":
            //sauvegarde du temps du memory
            if (isset($_GET["seconds"]) && is_numeric($_GET["seconds"]) && isset($_GET["click"]) && is_numeric($_GET["click"])) {
                $c->saveMemory('', intval($_GET["seconds"]), intval($_GET["click"]));
            }
            $c->disconnect();
            break;
            //affichage du record
        case "record":
            echo json_encode(array("record" => $c->getRecordTime()));
            $c->disconnect();
            break;
    }
}
