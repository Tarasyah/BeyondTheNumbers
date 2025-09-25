
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMartyrs } from "@/lib/api"
import type { Martyr } from "@/lib/types"

export default async function MartyrsPage() {
  const response = await getMartyrs();
  const data = response?.killed_in_gaza || [];

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
                  <TableHead className="w-[200px]">Date of Birth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((martyr, index) => (
                  <TableRow key={martyr.id || index}>
                    <TableCell className="font-medium">{martyr.en_name}</TableCell>
                    <TableCell>{martyr.age}</TableCell>
                    <TableCell>{martyr.sex === 'f' ? 'Female' : 'Male'}</TableCell>
                    <TableCell>
                      {martyr.dob ? new Date(martyr.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) : 'N/A'}
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
