<?php
class ConnectMemory
{
    public $conn;

    public function __construct(string $servername, string $username, string $password, string $dbname)
    {
        $this->conn = new mysqli($servername, $username, $password, $dbname);
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function saveMemory($name = '', $seconds = 0, $click = 0)
    {
        $stmt = $this->conn->prepare("INSERT INTO score (name, seconds, click) VALUES (?, ?, ?)");
        $stmt->bind_param("sii", $name, $seconds, $click);
        $stmt->execute();
        $stmt->close();
    }

    public function getRecordTime()
    {
        $stmt = $this->conn->prepare("select min(seconds) as record from score");
        $stmt->execute();
        $stmt->bind_result($resultat);
        if ($stmt->fetch()) {
            $hour = intval(intval($resultat) / 3600);
            $resultat = intval(intval($resultat) - intval(intval($resultat) / 3600) * 3600);
            $minutes = intval(intval($resultat) / 60);
            $seconds = intval(intval($resultat) - intval(intval($resultat) / 60) * 60);
            return str_pad($hour, 2, '0', STR_PAD_LEFT) . ":" . str_pad($minutes, 2, '0', STR_PAD_LEFT) . ":" . str_pad($seconds, 2, '0', STR_PAD_LEFT);
        } else {
            return '00:00:00';
        }
    }

    public function disconnect()
    {
        $this->conn->close();
    }
}
