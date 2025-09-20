'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Database,
  Hash,
  Type,
  Calendar,
  Mail,
  Link,
  ToggleLeft,
  List,
  FileText,
} from 'lucide-react';
import { DataSchema } from '@/types/league';
import { cn } from '@/lib/utils';

interface SchemaVisualizationProps {
  schema: DataSchema;
  className?: string;
  expandedByDefault?: boolean;
}

interface SchemaNodeProps {
  schema: DataSchema;
  level?: number;
  path?: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'string':
      return Type;
    case 'number':
      return Hash;
    case 'boolean':
      return ToggleLeft;
    case 'array':
      return List;
    case 'object':
      return Database;
    case 'date':
      return Calendar;
    case 'email':
      return Mail;
    case 'url':
      return Link;
    default:
      return FileText;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'string':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'number':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'boolean':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'array':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'object':
      return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    case 'date':
      return 'text-pink-600 bg-pink-50 border-pink-200';
    case 'email':
      return 'text-cyan-600 bg-cyan-50 border-cyan-200';
    case 'url':
      return 'text-teal-600 bg-teal-50 border-teal-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

function SchemaNode({ schema, level = 0, path = '' }: SchemaNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const Icon = getTypeIcon(schema.type);
  const colorClass = getTypeColor(schema.type);

  const hasChildren =
    (schema.type === 'object' && schema.properties) ||
    (schema.type === 'array' && schema.items);

  const currentPath = path ? `${path}.${schema.name}` : schema.name;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: level * 0.05 }}
      className="space-y-2"
    >
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer',
          colorClass
        )}
        style={{ marginLeft: `${level * 20}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button className="flex-shrink-0 p-1 hover:bg-white/50 rounded">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* Type Icon */}
        <Icon className="h-5 w-5 flex-shrink-0" />

        {/* Field Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{schema.name}</span>
            <span className="text-xs px-2 py-1 bg-white/70 rounded font-mono">
              {schema.type}
            </span>
          </div>

          {schema.description && (
            <p className="text-xs opacity-75 mt-1 truncate">
              {schema.description}
            </p>
          )}

          {/* Example Value */}
          {schema.example !== undefined && (
            <div className="text-xs mt-1 font-mono bg-white/50 px-2 py-1 rounded">
              <span className="opacity-60">example: </span>
              <span>
                {typeof schema.example === 'string'
                  ? `"${schema.example}"`
                  : JSON.stringify(schema.example)}
              </span>
            </div>
          )}
        </div>

        {/* Path Badge */}
        <div className="text-xs bg-white/50 px-2 py-1 rounded font-mono opacity-60">
          {currentPath}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-2"
        >
          {/* Object Properties */}
          {schema.type === 'object' && schema.properties && (
            <>
              {Object.entries(schema.properties).map(([key, childSchema]) => (
                <SchemaNode
                  key={key}
                  schema={{ ...childSchema, name: key }}
                  level={level + 1}
                  path={currentPath}
                />
              ))}
            </>
          )}

          {/* Array Items */}
          {schema.type === 'array' && schema.items && (
            <SchemaNode
              schema={{ ...schema.items, name: '[item]' }}
              level={level + 1}
              path={currentPath}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export function SchemaVisualization({
  schema,
  className,
  expandedByDefault = true,
}: SchemaVisualizationProps) {
  const [globalExpanded, setGlobalExpanded] = useState(expandedByDefault);

  const getSchemaStats = (schema: DataSchema): { fields: number; depth: number } => {
    let fields = 0;
    let maxDepth = 0;

    const traverse = (node: DataSchema, depth: number = 0) => {
      maxDepth = Math.max(maxDepth, depth);

      if (node.type === 'object' && node.properties) {
        Object.values(node.properties).forEach((prop) => {
          fields++;
          traverse(prop, depth + 1);
        });
      } else if (node.type === 'array' && node.items) {
        traverse(node.items, depth + 1);
      } else {
        fields++;
      }
    };

    traverse(schema);
    return { fields, depth: maxDepth };
  };

  const stats = getSchemaStats(schema);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Schema Header */}
      <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            {schema.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {stats.fields} fields • {stats.depth} levels deep
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGlobalExpanded(!globalExpanded)}
            className="text-sm px-3 py-1 bg-secondary hover:bg-secondary/80 rounded transition-colors"
          >
            {globalExpanded ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Schema Tree */}
      <div className="border rounded-lg p-4 bg-card space-y-2 max-h-96 overflow-y-auto">
        <SchemaNode schema={schema} />
      </div>

      {/* Schema Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.fields}</div>
          <div className="text-sm text-blue-600">Total Fields</div>
        </div>
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.depth}</div>
          <div className="text-sm text-green-600">Max Depth</div>
        </div>
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {schema.type === 'array' ? '∞' : '1'}
          </div>
          <div className="text-sm text-purple-600">Records</div>
        </div>
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">
            {schema.type === 'object' ? 'Object' : schema.type === 'array' ? 'Array' : 'Simple'}
          </div>
          <div className="text-sm text-orange-600">Type</div>
        </div>
      </div>
    </div>
  );
}