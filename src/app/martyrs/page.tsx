import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { martyrs } from "@/lib/data"
import type { Martyr } from "@/lib/types"

async function getMartyrs(): Promise<Martyr[]> {
  // In a real application, you would fetch this data from an API.
  // For this example, we're returning the mock data sorted by date.
  const sortedMartyrs = [...martyrs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return Promise.resolve(sortedMartyrs);
}

export default async function MartyrsPage() {
  const data = await getMartyrs();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Roll of Martyrs</h1>
        <p className="text-muted-foreground">
          A partial list of the names of those killed. We honor their memory.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Victims</CardTitle>
          <CardDescription>
            This list is tragically incomplete and represents only a fraction of the total lives lost.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[100px]">Age</TableHead>
                  <TableHead className="w-[100px]">Sex</TableHead>
                  <TableHead className="w-[200px]">Date of Martyrdom</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((martyr) => (
                  <TableRow key={martyr.id}>
                    <TableCell className="font-medium">{martyr.name}</TableCell>
                    <TableCell>{martyr.age}</TableCell>
                    <TableCell>{martyr.sex}</TableCell>
                    <TableCell>
                      {new Date(martyr.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
