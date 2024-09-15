import { Header } from "@/components/Header";
import { ReviewsList } from "@/components/ReviewsList";
import { Newsletter } from "@/components/Newsletter";
import { Top10Popular } from "@/components/Top10Popular";
import { Footer } from "@/components/Footer";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ReviewsList />
                    <aside className="space-y-8">
                        <Newsletter />
                        <Top10Popular />
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}
