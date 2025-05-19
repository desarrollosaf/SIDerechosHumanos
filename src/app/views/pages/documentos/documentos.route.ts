import { Routes } from "@angular/router";

export default [
    { path: '', redirectTo: 'documentos', pathMatch: 'full' },
    {
        path: 'documentos',
        loadComponent: () => import('./documentos.component').then(c => c.DocumentosComponent)
    },
    {
        path: 'add-documentos',
        loadComponent: () => import('./add-edit-documentos/add-edit-documentos.component').then(c => c.AddEditDocumentosComponent)
    },
] as Routes;