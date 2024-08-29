"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ChevronDown, Search, Trash, X } from "lucide-react";
import { useState } from "react";

// Simulated data for collections and records
const collections = [
  { id: "1", name: "Users" },
  { id: "2", name: "Products" },
  { id: "3", name: "Orders" },
];

const records = Array.from({ length: 100 }, (_, i) => ({
  id: `${i + 1}`,
  document: `Document ${i + 1}`,
  metadata: { type: "Type A", category: "Category 1" },
  embeddings: [0.1, 0.2, 0.3, 0.4, 0.5],
}));

export default function RecordManager() {
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [showDropAlert, setShowDropAlert] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<
    (typeof records)[0] | null
  >(null);
  const [metadataQuery, setMetadataQuery] = useState("");

  const totalRecords = records.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const displayedRecords = records.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecords(displayedRecords.map((record) => record.id));
    } else {
      setSelectedRecords([]);
    }
  };

  const handleSelectRecord = (recordId: string, checked: boolean) => {
    if (checked) {
      setSelectedRecords([...selectedRecords, recordId]);
    } else {
      setSelectedRecords(selectedRecords.filter((id) => id !== recordId));
    }
  };

  const handleDeleteSelected = () => {
    console.log("Deleting selected records:", selectedRecords);
    // Implement the actual delete logic here
  };

  const handleDropCollection = () => {
    setShowDropAlert(true);
  };

  const confirmDropCollection = () => {
    console.log("Dropping collection:", selectedCollection);
    // Implement the actual drop collection logic here
    setShowDropAlert(false);
  };

  const handleRecordsPerPageChange = (value: string) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing records per page
  };

  const handleRecordClick = (record: (typeof records)[0]) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleMetadataQuery = () => {
    try {
      const query = JSON.parse(metadataQuery);
      console.log("Querying metadata:", query);
      // Implement the actual metadata query logic here
    } catch (error) {
      console.error("Invalid JSON input:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const handleClearMetadataQuery = () => {
    setMetadataQuery("");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="collection-select" className="text-sm font-medium">
            Select Collection:
          </Label>
          <Select
            value={selectedCollection}
            onValueChange={setSelectedCollection}
          >
            <SelectTrigger id="collection-select" className="w-[200px]">
              <SelectValue placeholder="Choose a collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {displayedRecords.length} of {totalRecords} records
        </div>
      </div>

      <div className="mb-4">
        <Label
          htmlFor="metadata-query"
          className="text-sm font-medium mb-2 block"
        >
          Metadata Query:
        </Label>
        <Textarea
          id="metadata-query"
          value={metadataQuery}
          onChange={(e) => setMetadataQuery(e.target.value)}
          placeholder='Enter JSON query (e.g., {"type": "Type A"})'
          className="font-mono text-sm mb-2"
          rows={4}
        />
        <div className="flex space-x-2">
          <Button onClick={handleMetadataQuery}>
            <Search className="mr-2 h-4 w-4" />
            Query
          </Button>
          <Button variant="outline" onClick={handleClearMetadataQuery}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteSelected}>
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedRecords.length === displayedRecords.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Metadata</TableHead>
            <TableHead>Embeddings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedRecords.map((record) => (
            <TableRow
              key={record.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRecordClick(record)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedRecords.includes(record.id)}
                  onCheckedChange={(checked) =>
                    handleSelectRecord(record.id, checked === true)
                  }
                />
              </TableCell>
              <TableCell>{record.id}</TableCell>
              <TableCell>{record.document}</TableCell>
              <TableCell>{JSON.stringify(record.metadata)}</TableCell>
              <TableCell>
                {record.embeddings.slice(0, 3).join(", ")}...
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <Select
          value={recordsPerPage.toString()}
          onValueChange={handleRecordsPerPageChange}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Per page" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100, 200].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <Button variant="destructive" onClick={handleDropCollection}>
          Drop Collection
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Drag and drop your collection here or click the button above to drop
          the current collection.
        </p>
      </div>

      {showDropAlert && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Are you sure you want to drop this collection? This action cannot be
            undone.
            <div className="mt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDropCollection}
              >
                Confirm Drop
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => setShowDropAlert(false)}
              >
                Cancel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Details</DialogTitle>
            <DialogDescription>
              Detailed information for the selected record.
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold">ID:</div>
                <div>{selectedRecord.id}</div>
                <div className="font-semibold">Document:</div>
                <div>{selectedRecord.document}</div>
                <div className="font-semibold">Metadata:</div>
                <div>{JSON.stringify(selectedRecord.metadata, null, 2)}</div>
                <div className="font-semibold">Embeddings:</div>
                <div>{selectedRecord.embeddings.join(", ")}</div>
              </div>
            </div>
          )}
          <Button className="mt-4" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
