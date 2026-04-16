import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { ContactSubmission } from "@/services/contactApi";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, LayoutDashboard, Calendar, Phone, Mail, User, Briefcase, FileText, Home, Eye, Archive, CheckCircle2, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface FirebaseContact extends ContactSubmission {
  id: string;
  createdAt?: string;
  status?: "active" | "read" | "archived";
}

const DashboardPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<FirebaseContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "read" | "archived">("active");
  const [selectedContact, setSelectedContact] = useState<FirebaseContact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseContact[];
      setContacts(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching contacts:", error);
      toast.error(t('admin.dashboard.loading'));
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [t]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // ProtectedRoute will automatically redirect to /admin
    } catch (error) {
      toast.error(t('admin.dashboard.logoutFailed'));
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: "active" | "read" | "archived") => {
    try {
      const contactRef = doc(db, "contacts", id);
      await updateDoc(contactRef, { status: newStatus });
      setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
      
      if (selectedContact && selectedContact.id === id) {
         setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteContact = (id: string) => {
    setContactToDelete(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      toast.success("Submission deleted");
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(null);
      }
      setContactToDelete(null);
    } catch (error) {
      toast.error("Failed to delete submission");
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const cStatus = c.status || "active";
    return cStatus === activeTab;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`min-h-screen bg-muted/20 pb-12 ${i18n.language === 'ar' ? 'font-arabic' : ''}`} dir={i18n.dir()}>
      <header className="bg-background border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-serif font-bold text-xl">
            <LayoutDashboard className="w-6 h-6" />
            <span>{t('admin.dashboard.title')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/${i18n.language}`)} className="gap-2">
              <Home className="w-4 h-4" />
              {t('nav.home')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              {t('admin.dashboard.logout')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8">
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">{t('admin.dashboard.contactSubmissions')}</CardTitle>
            <CardDescription>
              {t('admin.dashboard.description')}
            </CardDescription>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-6 pt-4 border-t border-border/50">
              <Button 
                variant={activeTab === 'active' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('active')} 
                size="sm">
                {t('admin.dashboard.tabActive')}
                <span className="ms-2 bg-background/20 px-2 py-0.5 rounded-full text-xs">
                  {contacts.filter(c => (c.status || 'active') === 'active').length}
                </span>
              </Button>
              <Button 
                variant={activeTab === 'read' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('read')} 
                size="sm">
                {t('admin.dashboard.tabRead')}
                <span className="ms-2 bg-background/20 px-2 py-0.5 rounded-full text-xs">
                  {contacts.filter(c => c.status === 'read').length}
                </span>
              </Button>
              <Button 
                variant={activeTab === 'archived' ? 'default' : 'outline'} 
                onClick={() => setActiveTab('archived')} 
                size="sm">
                {t('admin.dashboard.tabArchived')}
                <span className="ms-2 bg-background/20 px-2 py-0.5 rounded-full text-xs">
                  {contacts.filter(c => c.status === 'archived').length}
                </span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center p-12 text-muted-foreground border-2 border-dashed rounded-lg">
                {t('admin.dashboard.noContacts')}
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[180px]">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {t('admin.dashboard.tableDate')}</div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2"><User className="w-4 h-4" /> {t('admin.dashboard.tableName')}</div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {t('admin.dashboard.tablePhone')}</div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {t('admin.dashboard.tableMethod')}</div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {t('admin.dashboard.tableService')}</div>
                      </TableHead>
                      <TableHead className="max-w-[300px]">
                        <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> {t('admin.dashboard.tableDetails')}</div>
                      </TableHead>
                      <TableHead className="w-[100px] text-center">
                        <div className="flex items-center justify-center gap-2">{t('admin.dashboard.tableActions')}</div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium whitespace-nowrap">
                          {formatDate(contact.createdAt)}
                        </TableCell>
                        <TableCell className="font-semibold">{contact.name}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>
                          <span className="capitalize px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {contact.contactMethod}
                          </span>
                        </TableCell>
                        <TableCell>{contact.service}</TableCell>
                        <TableCell className="max-w-[300px] truncate" title={contact.details}>
                          {contact.details}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setSelectedContact(contact)} title={t('admin.dashboard.viewDetails')}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {(contact.status || 'active') !== 'archived' && (
                              <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-orange-500/10 hover:text-orange-500 transition-colors" onClick={() => handleStatusUpdate(contact.id, 'archived')} title={t('admin.dashboard.moveToArchive')}>
                                <Archive className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={() => handleDeleteContact(contact.id)} title={t('admin.dashboard.delete')}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Viewer Modal */}
      <AnimatePresence>
        {selectedContact && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[100]"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-[50%] left-[50%] !-translate-x-[50%] !-translate-y-[50%] w-[calc(100%-2rem)] max-w-2xl max-h-[calc(100vh-2rem)] bg-background rounded-2xl shadow-2xl z-[101] flex flex-col"
            >
              <div className="p-6 md:p-8 overflow-y-auto flex-1 text-start">
                 <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
                  <h2 className="text-xl md:text-2xl font-bold font-serif text-primary">
                    {t('admin.dashboard.viewDetails')}
                  </h2>
                  <button onClick={() => setSelectedContact(null)} className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 bg-muted/20 p-4 sm:p-6 rounded-xl border border-border/50">
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><User className="w-4 h-4"/> {t('admin.dashboard.tableName')}</p>
                        <p className="font-semibold text-lg">{selectedContact.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Phone className="w-4 h-4"/> {t('admin.dashboard.tablePhone')}</p>
                        <p className="font-semibold text-lg" dir="ltr">{selectedContact.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Mail className="w-4 h-4"/> {t('admin.dashboard.tableMethod')}</p>
                        <span className="capitalize px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary inline-block mt-1">
                          {selectedContact.contactMethod}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Briefcase className="w-4 h-4"/> {t('admin.dashboard.tableService')}</p>
                        <p className="font-semibold text-lg">{selectedContact.service}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1"><Calendar className="w-4 h-4"/> {t('admin.dashboard.tableDate')}</p>
                        <p className="font-semibold text-lg">{formatDate(selectedContact.createdAt)}</p>
                      </div>
                    </div>

                    {selectedContact.details && (
                      <div className="bg-muted/20 p-4 sm:p-6 rounded-xl border border-border/50">
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3"><FileText className="w-4 h-4"/> {t('admin.dashboard.tableDetails')}</p>
                        <p className="leading-relaxed whitespace-pre-wrap text-foreground/90">{selectedContact.details}</p>
                      </div>
                    )}
                 </div>

                 <div className="flex flex-wrap gap-2 justify-end mt-8 border-t border-border/50 pt-6">
                    {(selectedContact.status || 'active') !== 'active' && (
                       <Button variant="outline" className="gap-2" onClick={() => handleStatusUpdate(selectedContact.id, 'active')}>
                         <CheckCircle2 className="w-4 h-4"/>
                         {t('admin.dashboard.moveToActive')}
                       </Button>
                    )}
                    {(selectedContact.status || 'active') !== 'read' && (
                       <Button variant="outline" className="gap-2" onClick={() => handleStatusUpdate(selectedContact.id, 'read')}>
                         <CheckCircle2 className="w-4 h-4"/>
                         {t('admin.dashboard.markAsRead')}
                       </Button>
                    )}
                    {(selectedContact.status || 'active') !== 'archived' && (
                       <Button variant="outline" className="gap-2" onClick={() => handleStatusUpdate(selectedContact.id, 'archived')}>
                         <Archive className="w-4 h-4"/>
                         {t('admin.dashboard.moveToArchive')}
                       </Button>
                    )}
                    <Button variant="destructive" className="gap-2 ms-auto" onClick={() => handleDeleteContact(selectedContact.id)}>
                      <Trash2 className="w-4 h-4"/>
                      {t('admin.dashboard.delete')}
                    </Button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {contactToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setContactToDelete(null)}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[110]"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               className="fixed top-[50%] left-[50%] !-translate-x-[50%] !-translate-y-[50%] w-[90%] max-w-md bg-background p-6 rounded-2xl z-[111] shadow-2xl flex flex-col text-center border overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-destructive"></div>
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-serif text-foreground">{t('admin.dashboard.deleteConfirmTitle', 'Delete Submission?')}</h3>
              <p className="text-muted-foreground mb-8">{t('admin.dashboard.deleteConfirmMessage', 'Are you sure you want to delete this submission? This action cannot be undone.')}</p>
              
              <div className="flex gap-3 justify-center">
                 <Button variant="outline" className="flex-1" onClick={() => setContactToDelete(null)}>
                   {t('admin.dashboard.cancel', 'Cancel')}
                 </Button>
                 <Button variant="destructive" className="flex-1" onClick={() => confirmDelete(contactToDelete)}>
                   {t('admin.dashboard.yesDelete', 'Yes, Delete')}
                 </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
