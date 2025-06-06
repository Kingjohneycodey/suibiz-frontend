import Image from "next/image";
interface ProfileCardProps {
    name: string;
    image: string;
    profileImage: string;
    itemsCount: number;
    totalVolume: number;
}


export default function ProfileCard ({ name, image, profileImage, itemsCount, totalVolume }: ProfileCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-30 bg-gray-200 relative">
                <Image 
                    src={image} 
                    alt={name} 
                    fill
                    className="object-cover"
                />
                
                <div className="absolute -bottom-8 left-4">
                    <div className="w-16 h-16 rounded-2xl border-2 border-white overflow-hidden bg-white">
                        <Image 
                            src={profileImage} 
                            alt={`${name}'s profile`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>        
            <div className="p-4 pt-2 mt-3">
                <div className="mt-6 flex justify-between items-end">
                    <div>
                        <h3 className="text-sm font-semibold">{name}</h3>
                        <p className="text-sm text-gray-500">{itemsCount} items</p>
                    </div>                    
                    <div className="text-right">
                        <p className="text-sm font-semibold">Total volume</p>
                        <p className="text-sm text-gray-500">{totalVolume} sui</p>
                    </div>
                </div>
            </div>
        </div>
    );
};