import { Metadata } from "next";
import ClientRedirect from "./ClientRedirect";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const imageUrl = `https://self-identity-image-storage.s3.amazonaws.com/${id}_Happy.png`;
    console.log("Image URL:", imageUrl)
    return {
        title: "Who Are You? The Science of Self Identity | Results",
        description: "I just analyzed my personality traits and identity markers using the Self-Identity survey. Take the assessment to see your own bell curve results and trait breakdown!",
        openGraph: {
            title: "Who Are You? The Science of Self Identity | Results",
            description: "I just completed the Self-Identity Project assessment. Click to see my personality bell curve and discover your own unique identity traits through the survey.",
            url: `https://self-identity.me/share/${id}`,
            siteName: "The Self-Identity Project",
            images: [
                {
                    url: imageUrl,
                    width: 1200, 
                    height: 630,
                    alt: "Data visualization showing personality trait distribution on a bell curve chart",
                },
            ],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "My Self-Identity Analysis: See My Results",
            description: "I just analyzed my identity traits! Take the scientific survey to see where you land on the bell curve and uncover your unique profile.",
            images: [imageUrl],
        },
    };

}

export default async function SharePage({ params }: Props) {
    const resolvedParams = await params;
    return <ClientRedirect id={resolvedParams.id} />;
}