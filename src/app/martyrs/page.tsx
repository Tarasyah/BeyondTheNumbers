import { createClient } from '@/utils/supabase/server';
import { MartyrsClientPage } from "./martyrs-client-page";
import type { Martyr } from "@/lib/types";

export default async function MartyrsPageWrapper() {
    const supabase = createClient();
    const { data: allMartyrs } = await supabase.from('martyrs').select('*');
    return <MartyrsClientPage allMartyrs={allMartyrs || []} />;
}
