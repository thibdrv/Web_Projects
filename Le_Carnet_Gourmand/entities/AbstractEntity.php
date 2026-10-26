<?php

// Toute classe qui en hérite peut être transformée automatiquement en JSON avec json_encode() :
// jsonSerialize() parcourt les propriétés (même privées) par réflexion.
// Les noms des propriétés reprennent ceux des colonnes SQL, ce sont donc aussi les clés du JSON.

require_once(ROOT . "/entities/IEntity.php");

abstract class AbstractEntity implements IEntity
{
    // Format des dates dans le JSON (identique au DATETIME de MySQL)
    public const DATE_FORMAT = "Y-m-d H:i:s";

    // Propriétés jamais envoyées au client (ex : hash du mot de passe)
    protected const HIDDEN_FIELDS = [];

    public function jsonSerialize(): array
    {
        $data = [];
        foreach ((new ReflectionClass($this))->getProperties() as $property) {
            if ($property->isStatic() || in_array($property->getName(), static::HIDDEN_FIELDS, true)) {
                continue;
            }
            $value = $property->isInitialized($this) ? $property->getValue($this) : null;
            if ($value instanceof DateTimeInterface) {
                $value = $value->format(self::DATE_FORMAT);
            }
            $data[$property->getName()] = $value;
        }
        return $data;
    }

    // Convertit une colonne DATETIME (chaîne) en objet DateTime
    protected static function toDateTime(?string $value): ?DateTime
    {
        return $value === null ? null : new DateTime($value);
    }
}
?>
