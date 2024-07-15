import { FixedAsset } from "@/app/data_interfaces/fixed-asset"
import { ThemedView } from "./ThemedView"
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";

const FixedAssetCardDetailedCard: React.FC<FixedAsset> = ({
    id,
    name,
    description,
    barcode,
    price,
    creationDate,
    assignedEmployeeId, // Reference to Employee
    assignedLocationId, // Reference to Location
    photoUrl
}) => {

    const textColor = useThemeColor({}, 'text');

    const defaultImageUrl = "@/assets/images/defaultImage.png";


    return (<ThemedView>
                <ThemedText>{id}</ThemedText>
                <ThemedText>{name}</ThemedText>
                <ThemedText>{description}</ThemedText>
                <ThemedText>{barcode}</ThemedText>
                <ThemedText>{creationDate.toString()}</ThemedText>
                <ThemedText>{assignedEmployeeId}</ThemedText>
                <ThemedText>{assignedLocationId}</ThemedText>
                <ThemedText>{price}</ThemedText>
                <ThemedText>{photoUrl}</ThemedText>
            </ThemedView>)
}

export default FixedAssetCardDetailedCard;